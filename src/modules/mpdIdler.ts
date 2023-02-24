/* eslint-disable @typescript-eslint/no-explicit-any */
import { createConnection, Socket } from 'node:net';
import { config } from './config';
import { log } from './log';

type TListener = (name: TSubsystemNames, at: number) => void;
type TSubsystemNames =
  | 'database' // The song database has been modified after update.
  | 'update' // A database update has started or finished. If the database was modified during the update, the database event is also emitted.
  | 'stored_playlist' // A stored playlist has been modified, renamed, created or deleted
  | 'playlist' // The queue (i.e. the current playlist) has been modified
  | 'player' // The player has been started, stopped or seeked or tags of the currently playing song have changed (e.g. received from stream)
  | 'mixer' // The volume has been changed
  | 'output' // An audio output has been added, removed or modified (e.g. renamed, enabled or disabled)
  | 'options' // Options like repeat, random, crossfade, replay gain
  | 'partition' // A partition was added, removed or changed
  | 'sticker' // The sticker database has been modified.
  | 'subscription' // A client has subscribed or unsubscribed to a channel
  | 'message' // A message was received on a channel this client is subscribed to; this event is only emitted when the queue is empty
  | 'neighbor' // A neighbor was found or lost
  | 'mount'; // The mount list has changed

const THROTTLE = 500;
const queue: Record<string, number> = {};
const listeners: TListener[] = [];
let isDisconnecting = false;
let queueInterval: NodeJS.Timer;
let socket: Socket;

function handleResponse(data: Buffer) {
  let text = data.toString('utf-8').trim();
  const isIdleMessage = text.startsWith('changed:') && text.endsWith('OK');
  if (!isIdleMessage) return;
  text = text.replace(/\n?OK$/, '');
  const lines = text.split('\n').map((line) => line.replace(/^changed:\s+/, '').trim());
  const subsystems = lines
    .join(',')
    .split(',')
    .filter((item) => item)
    .sort();
  subsystems.forEach((name) => (queue[name] = Date.now()));
}

function processQueue() {
  const keys = Object.keys(queue);
  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];
    if (queue[key] > 0) {
      log.info(`[mpd-idle] subsystem changed (${key})`);
      listeners.forEach((cb) => cb(key as TSubsystemNames, queue[key]));
      queue[key] = 0;
    }
  }
  queueInterval = setTimeout(processQueue, THROTTLE);
}

function connect() {
  log.info('[mpd-idle] socket connnect');
  const { host, port } = config.mpd;
  socket = createConnection(port, host);
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    handleResponse(data);
    socket.write('idle\n');
  });
  socket.on('close', function () {
    log.info('[mpd-idle] socket close');
  });
  socket.on('error', (err) => {
    log.error('[mpd-idle] socket error', err);
  });
  processQueue();
}

function disconnect() {
  if (isDisconnecting) return;
  clearTimeout(queueInterval);
  log.info('[mpd-idle] socket end');
  socket.end();
  isDisconnecting = true;
}

function addListener(cb: TListener) {
  if (!listeners.includes(cb)) listeners.push(cb);
}

export const mpdIdler = {
  connect,
  addListener,
  disconnect,
};
