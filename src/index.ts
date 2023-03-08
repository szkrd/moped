import 'dotenv/config';
import express from 'express';
import { debounce } from 'lodash';
import fs from 'fs';
import { Server as SocketIO } from 'socket.io';
import { config } from './modules/config';
import { log } from './modules/log';
import { mpd } from './modules/mpd';
import { mpdIdler } from './modules/mpdIdler';
import { setupRoutes } from './routes/routes';
import { onExit } from './utils/process';

// mpd setup and teardown
mpd.connect();
mpdIdler.connect();
onExit(() => {
  mpd.disconnect();
  mpdIdler.disconnect();
});

// fire up express
const app = express();
app.use(express.json());
setupRoutes(app);

// serve public
if (config.publicDir) {
  const { publicDir } = config;
  if (!fs.existsSync(publicDir)) {
    log.warn(`[express] public directory "${publicDir}" not found, static serve disabled.`);
  } else {
    app.use(express.static(publicDir));
    log.info(`[express] serving public directory "${publicDir}" in /`);
  }
}

// fallback if no other route handler matches the request
app.use((req, res) => {
  res.status(404);
  if (req.path.startsWith('/api/')) {
    res.json({ error: 'Not found' });
  } else {
    res.send('Not found');
  }
});

// start express
const server = app.listen(config.port, config.host, () => {
  const { host, port } = config;
  log.info(`[express] express listening on ${host}:${port}`);
});

// add socketio
const io = new SocketIO(server);
io.on('connection', (socket) => {
  log.info('[socketio] client connected');
  mpdIdler.addListener(
    debounce((subsystem, at) => {
      io.emit('idle', { subsystem, at }); // broadcast to everyone
      log.info(`[socketio] idle message for subsystem "${subsystem}"`);
    }, 1000)
  );
  socket.on('disconnect', () => {
    log.info('[socketio] client disconnected');
  });
});
