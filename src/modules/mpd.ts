import { createConnection, Socket } from 'node:net';
import util from 'util';
import { EventEmitter } from 'node:events';
import assert from 'assert';
import { parseMpdMessage } from '../utils/mpd';
import { config } from './config';
import { log } from './log';

// const MPD_SENTINEL = /^(OK|ACK|list_OK)(.*)$/m;
// const OK_MPD = /^OK MPD /;

// module.exports = MpdClient;
// MpdClient.Command = Command;
// MpdClient.cmd = cmd;
// MpdClient.parseKeyValueMessage = parseMpdMessage.asKeyValue;
// MpdClient.parseArrayMessage = parseMpdMessage.asArray;

// ---------------------------------------------------------

// const emitter = new EventEmitter();
let socket: Socket;

function connect() {
  log.info('Mpd connect.');
  const { host, port } = config.mpd;
  socket = createConnection(port, host);
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    console.log('mpd>>>', 'receive', data);
    // receive(data);
  });
  socket.on('close', function () {
    console.log('mpd>>> close');
  });
  socket.on('error', (err) => {
    console.log('mpd>>> error', err);
  });
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
  connect,
  ping,
  disconnect,
};

// ---------------------------------------------------------

/*
function MpdClient() {
  EventEmitter.call(this);

  this.buffer = '';
  this.msgHandlerQueue = [];
  this.idling = false;
}
util.inherits(MpdClient, EventEmitter);

var defaultConnectOpts = {
  host: 'localhost',
  port: 6600,
};

MpdClient.connect = function (options) {
  options = options || defaultConnectOpts;

  var client = new MpdClient();
  client.socket = net.connect(options, function () {
    client.emit('connect');
  });
  client.socket.setEncoding('utf8');
  client.socket.on('data', function (data) {
    client.receive(data);
  });
  client.socket.on('close', function () {
    client.emit('end');
  });
  client.socket.on('error', function (err) {
    client.emit('error', err);
  });
  return client;
};

MpdClient.disconnect = function () {
  this.socket.destroy();
};

MpdClient.prototype.receive = function (data) {
  var m;
  this.buffer += data;
  while ((m = this.buffer.match(MPD_SENTINEL))) {
    var msg = this.buffer.substring(0, m.index),
      line = m[0],
      code = m[1],
      str = m[2];
    if (code === 'ACK') {
      var err = new Error(str);
      this.handleMessage(err);
    } else if (OK_MPD.test(line)) {
      this.setupIdling();
    } else {
      this.handleMessage(null, msg);
    }

    this.buffer = this.buffer.substring(msg.length + line.length + 1);
  }
};

MpdClient.prototype.handleMessage = function (err, msg) {
  var handler = this.msgHandlerQueue.shift();
  handler(err, msg);
};

MpdClient.prototype.setupIdling = function () {
  var self = this;
  self.sendWithCallback('idle', function (err, msg) {
    self.handleIdleResultsLoop(err, msg);
  });
  self.idling = true;
  self.emit('ready');
};

MpdClient.prototype.sendCommand = function (command, callback) {
  var self = this;
  callback = callback || noop.bind(this);
  assert.ok(self.idling);
  self.send('noidle\n');
  self.sendWithCallback(command, callback);
  self.sendWithCallback('idle', function (err, msg) {
    self.handleIdleResultsLoop(err, msg);
  });
};

MpdClient.prototype.sendCommands = function (commandList, callback) {
  var fullCmd = 'command_list_begin\n' + commandList.join('\n') + '\ncommand_list_end';
  this.sendCommand(fullCmd, callback || noop.bind(this));
};

MpdClient.prototype.handleIdleResultsLoop = function (err, msg) {
  var self = this;
  if (err) {
    self.emit('error', err);
    return;
  }
  self.handleIdleResults(msg);
  if (self.msgHandlerQueue.length === 0) {
    self.sendWithCallback('idle', function (err, msg) {
      self.handleIdleResultsLoop(err, msg);
    });
  }
};

MpdClient.prototype.handleIdleResults = function (msg) {
  var self = this;
  msg.split('\n').forEach(function (system) {
    if (system.length > 0) {
      var name = system.substring(9);
      self.emit('system-' + name);
      self.emit('system', name);
    }
  });
};

MpdClient.prototype.sendWithCallback = function (cmd, cb) {
  cb = cb || noop.bind(this);
  this.msgHandlerQueue.push(cb);
  this.send(cmd + '\n');
};

MpdClient.prototype.send = function (data) {
  this.socket.write(data);
};

function Command(name, args) {
  this.name = name;
  this.args = args;
}

Command.prototype.toString = function () {
  return this.name + ' ' + this.args.map(argEscape).join(' ');
};

function argEscape(arg) {
  // replace all " with \"
  return '"' + arg.toString().replace(/"/g, '\\"') + '"';
}

function noop(err) {
  if (err) this.emit('error', err);
}

// convenience
function cmd(name, args) {
  return new Command(name, args);
}
*/
