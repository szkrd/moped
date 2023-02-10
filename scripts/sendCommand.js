const net = require('net');
const port = parseInt(process.env.PORT, 10) || 6600;
const host = process.env.HOST || '192.168.0.110';

if (process.argv.some((text) => ['--help', '-h'].includes(text))) {
  console.info('Send single command to mpd server.\nEnv vars: HOST, PORT.\nArgs: [command]');
  process.exit(0);
}
let command = process.argv[2] || 'stats';

console.info('[mpd] connect');
const socket = net.createConnection(port, host);
socket.setEncoding('utf8');

socket.on('data', (data) => {
  data = data.toString();
  console.log('[mpd] receive:\n', data);
  // we have the initial version response
  if (data.startsWith('OK MPD')) {
    console.log(`[mpd] send: "${command}"`);
    socket.write(`${command}\n`);
  } else if (data.trim().endsWith('OK')) {
    socket.destroy();
    process.exit(0);
  }
});

socket.on('close', function () {
  console.log('[mpd] close');
});

socket.on('error', (err) => {
  console.log('[mpd] error:', err);
});

process.on('SIGINT', () => {
  socket.destroy();
});
