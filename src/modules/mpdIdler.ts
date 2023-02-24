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

// const MPD_SENTINEL = /^(OK|ACK|list_OK)(.*)$/m;
// const OK_MPD = /^OK MPD /;

// module.exports = MpdClient;
// MpdClient.Command = Command;
// MpdClient.cmd = cmd;
// MpdClient.parseKeyValueMessage = parseMpdMessage.asKeyValue;
// MpdClient.parseArrayMessage = parseMpdMessage.asArray;

// ---------------------------------------------------------

interface IQueuedMessage {
  command: MpdCommand;
  message: string;
  inProgress?: boolean;
  finished?: boolean;
  error?: IMpdError;
  onSuccess?: (response: string) => void;
  onError?: (err: IMpdError) => void;
  rawResponse?: string;
}

// const emitter = new EventEmitter();
let socket: Socket;
// let buffer = '';
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
    console.log('Rec mpd version:', mpdVersion);
    return;
  }
  const current = messageQueue.find((item) => item.inProgress);
  if (!current) {
    console.log('Stray message response.');
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
  // let match: RegExpMatchArray | null;
  // buffer += data;
  // A command returns OK on completion or ACK some error on failure.
  // These denote the end of command execution.
  // while ((match = buffer.match(/^(OK|ACK|list_OK)(.*)$/m))) {
  //   const msg = buffer.substring(0, match.index);
  //   const line = match[0];
  //   const code = match[1];
  //   const str = match[2];
  //   if (code === 'ACK') {
  //     console.log('rec ACK: ', str);
  //     //var err = new Error(str);
  //     //this.handleMessage(err);
  //   } else if (line.startsWith('OK MPD ')) {
  //     //this.setupIdling();
  //     mpdVersion = line.split(/\s+/)[2];
  //     console.log('rec OK.', mpdVersion);
  //   } else {
  //     console.log('handle msg: ', msg);
  //     //this.handleMessage(null, msg);
  //   }

  //   buffer = buffer.substring(msg.length + line.length + 1);
  // }
}

function sendCommand(command: MpdCommand, args: string | string[] = []) {
  if (!Array.isArray(args)) args = [args];
  // If arguments contain spaces, they should be surrounded by double quotation marks.
  if (!Object.values(MpdCommand).includes(command)) throw new Error('Unknown command');
  const quotedArgs = args.map((arg) => (/\s/g.test(arg) ? `"${arg}"` : arg));
  // A command sequence is terminated by the newline character.
  const message = [command, ...quotedArgs].join(' ') + '\n';
  log.info(`Sending command: ${message}`);
  return new Promise<string>((resolve, reject) => {
    messageQueue.push({
      command,
      message,
      onSuccess: (resp: string) => {
        console.log('on success:', resp);
        resolve(resp);
      },
      onError: (err: IMpdError) => {
        console.log('on error:', err);
        reject(err);
      },
    });
  });
  // socket.write(message);
  // return new Promise((resolve, reject) => {
  // });
  // socket.write('idle');
  // var self = this;
  // callback = callback || noop.bind(this);
  // assert.ok(self.idling);
  // self.send('noidle\n');
  // self.sendWithCallback(command, callback);
  // self.sendWithCallback('idle', function (err, msg) {
  //   self.handleIdleResultsLoop(err, msg);
  // });
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
      finishedItem.onSuccess(finishedItem.rawResponse ?? '');
    }
    if (finishedItem.onError && finishedItem.error) {
      finishedItem.onError(finishedItem.error);
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
  log.info('Mpd idler connect.');
  const { host, port } = config.mpd;
  socket = createConnection(port, host);
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    console.log('on idle data:', data);
    receive(data.toString());
  });
  socket.on('close', function () {
    console.log('mpd>>> close');
  });
  socket.on('error', (err) => {
    console.log('mpd>>> error', err);
  });
  // Idle mode probably is better suited for a live socket connection, not a rest interface
  // (Idle mode waits until there is a noteworthy change in one or more of MPD’s subsystems.
  // As soon as there is one, it lists all changed systems.)
  socket.write('noidle\n');
  setTimeout(processMessageQueue, QUEUE_TIMEOUT);
}

/**
 * Closes the connection to MPD; (just closes the socket,
 * as the protocol requires, without sending explicit "close").
 */
function disconnect() {
  log.info('Mpd disconnect.');
  socket.end();
}

/**
 * Sends "ping" (which does nothing but return "OK".)
 */
function ping() {
  // TODO
}

export const mpd = {
  isMinVer,
  connect,
  ping,
  disconnect,
  sendCommand,
};