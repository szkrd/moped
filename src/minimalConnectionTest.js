const net = require('net');
const port = 6600;
const host = '192.168.0.110';
console.info('Mpd connect.');
const socket = net.createConnection(port, host);
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log('mpd receive:', data.toString());
});
socket.on('close', function () {
  console.log('mpd>>> close');
});
socket.on('error', (err) => {
  console.log('mpd>>> error', err);
});

process.on('SIGINT', () => {
  socket.destroy();
});

setTimeout(() => {
  console.log('1>>> writing');
  socket.write('stats\n');
}, 2000);
