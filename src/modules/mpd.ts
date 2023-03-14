/* eslint-disable @typescript-eslint/no-explicit-any */
import { createConnection, Socket } from 'node:net';
import { MpdCommand } from '../models/mpdCommand';
import { IMpdError } from '../models/mpdResponse/error';
import { normalizeVersion, parseMpdError } from '../utils/mpd';
import { config } from './config';
import { log } from './log';

/** Message queue process interval */
const QUEUE_TIMEOUT = 1000;

/** Send "ping" to mpd to prevent socket close; tick increment happens on QUEUE_TIMEOUT */
const KEEPALIVE_TICK = 10;

// ---------------------------------------------------------

interface IQueuedMessage {
  command: MpdCommand;
  message: string;
  inProgress?: boolean;
  finished?: boolean;
  error?: IMpdError;
  onSuccess?: Array<(response: string) => void>;
  onError?: Array<(err: IMpdError) => void>;
  rawResponse?: string;
}

let socket: Socket;
let isDisconnecting = false;
let mpdVersion = '';
let messageQueue: IQueuedMessage[] = [];
let heartBeat = 0;

function isMinVer(ver: string) {
  return normalizeVersion(mpdVersion) >= normalizeVersion(ver);
}

function receive(data: string) {
  let processed = false;
  if (data.startsWith('OK MPD ')) {
    mpdVersion = data.split(/\s+/)[2];
    log.info('[mpd] mpd version:', mpdVersion);
    return;
  }
  const current = messageQueue.find((item) => item.inProgress);
  if (!current) {
    log.info('[log] stray message response.');
    return;
  }
  current.rawResponse = current.rawResponse ?? '';
  if (data === 'OK' || /OK\n+$/.test(data)) {
    if (data.endsWith('\nOK\n')) current.rawResponse += data.replace(/OK\n+$/, '');
    processed = true;
  } else if (data.startsWith('ACK ')) {
    current.rawResponse += data.replace(/ACK /, '');
    current.error = parseMpdError(data);
    processed = true;
  }
  if (processed) {
    current.inProgress = false;
    current.finished = true;
    return;
  }
  current.rawResponse += data;
}

function addToMessageQueue(msg: IQueuedMessage) {
  const idx = messageQueue.findIndex(
    (queued) => queued.message === msg.message && !queued.finished && !queued.inProgress
  );
  if (idx === -1) {
    messageQueue.push(msg);
  } else {
    const onSuccess = messageQueue[idx].onSuccess ?? [];
    const onError = messageQueue[idx].onError ?? [];
    if (msg.onSuccess && msg.onSuccess.length > 0) messageQueue[idx].onSuccess = onSuccess.concat(msg.onSuccess);
    if (msg.onError && msg.onError.length > 0) messageQueue[idx].onError = onError.concat(msg.onError);
  }
}

function sendCommand(command: MpdCommand, args: string | undefined | string[] = []) {
  if (!Array.isArray(args)) args = [args];
  // remove undefineds
  args = args.filter((val) => val !== undefined);
  // If arguments contain spaces, they should be surrounded by double quotation marks.
  if (!Object.values(MpdCommand).includes(command)) throw new Error('Unknown command');
  const quotedArgs = args.map((arg) => (/\s/g.test(arg) ? `"${arg}"` : arg));
  // A command sequence is terminated by the newline character.
  const message = [command, ...quotedArgs].join(' ') + '\n';
  log.info(`[mpd] sending command: ${message.trim()}`);
  return new Promise<string>((resolve, reject) => {
    addToMessageQueue({
      command,
      message,
      onSuccess: [
        (resp: string) => {
          log.info('[mpd] on success:', resp || 'no data.');
          resolve(resp);
        },
      ],
      onError: [
        (err: IMpdError) => {
          log.info('[mpd] on error:', err);
          reject(err);
        },
      ],
    });
  });
}

function processMessageQueue() {
  const next = () => {
    setTimeout(processMessageQueue, QUEUE_TIMEOUT);
  };
  heartBeat++;
  if (messageQueue.length === 0) {
    if (heartBeat > KEEPALIVE_TICK) {
      heartBeat = 0;
      sendCommand(MpdCommand.Ping);
    } else {
      return next();
    }
  }
  const finishedItem = messageQueue.find((item) => item.finished);
  if (finishedItem) {
    if (finishedItem.onSuccess && !finishedItem.error) {
      finishedItem.onSuccess.forEach((fn) => fn(finishedItem.rawResponse ?? ''));
    }
    if (finishedItem.onError && finishedItem.error) {
      finishedItem.onError.forEach((fn) => fn(finishedItem.error));
    }
  }
  messageQueue = messageQueue.filter((item) => !item.finished);
  const hasInProgress = messageQueue.some((item) => item.inProgress);
  if (hasInProgress) return next();
  const nextItem = messageQueue[0];
  if (nextItem) {
    nextItem.inProgress = true;
    socket.write(nextItem.message);
  }
  next();
}

function connect() {
  log.info('[mpd] socket connnect');
  const { host, port } = config.mpd;
  socket = createConnection(port, host);
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    const details = data.length > 10 ? `(length: ${data.length})` : `(${String(data).trim()})`;
    log.info('[mpd] socket data ' + details);
    receive(data.toString());
  });
  socket.on('close', function () {
    log.info('[mpd] socket close');
  });
  socket.on('error', (err) => {
    log.error('[mpd] socket error', err);
  });
  // idle mode will be handled through a different connection
  socket.write('noidle\n');
  setTimeout(processMessageQueue, QUEUE_TIMEOUT);
}

/**
 * Closes the connection to MPD; (just closes the socket,
 * as the protocol requires, without sending explicit "close").
 */
function disconnect() {
  if (isDisconnecting) return;
  log.info('[mpd] socket end');
  socket.end();
  isDisconnecting = true;
}

export const mpd = {
  isMinVer,
  connect,
  disconnect,
  sendCommand,
};
