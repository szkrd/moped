import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import { Server as SocketIO } from 'socket.io';
import { config } from './modules/config';
import { log } from './modules/log';
import { mpd } from './modules/mpd';
import { mpdIdler } from './modules/mpdIdler';
import { controllingPlaybackRoutes } from './routes/controllingPlaybackRoutes';
import { playbackOptionsRoutes } from './routes/playbackOptionsRoutes';
import { statusRoutes } from './routes/statusRoutes';
import { onExit } from './utils/process';

mpd.connect();
mpdIdler.connect();
onExit(() => {
  mpd.disconnect();
  mpdIdler.disconnect();
});

const app = express();
app.use(express.json());

statusRoutes.GET_clearError(app, '/api/status/clear-error');
statusRoutes.GET_currentSong(app, '/api/status/current-song');
statusRoutes.GET_status(app, '/api/status/status');
statusRoutes.GET_stats(app, '/api/status/stats');
playbackOptionsRoutes.GET_consume(app, '/api/playback-options/consume'); // ?state
playbackOptionsRoutes.GET_crossfade(app, '/api/playback-options/crossfade'); // ?seconds
playbackOptionsRoutes.GET_mixrampDb(app, '/api/playback-options/mixramp-db'); // ?decibels
playbackOptionsRoutes.GET_mixrampDelay(app, '/api/playback-options/mixramp-delay'); // ?seconds
playbackOptionsRoutes.GET_random(app, '/api/playback-options/random'); // ?state
playbackOptionsRoutes.GET_repeat(app, '/api/playback-options/repeat'); // ?state
playbackOptionsRoutes.GET_volume(app, '/api/playback-options/volume'); // none or ?vol
playbackOptionsRoutes.GET_single(app, '/api/playback-options/single'); // ?state
playbackOptionsRoutes.GET_replayGainStatus(app, '/api/playback-options/replay-gain-status');
playbackOptionsRoutes.GET_replayGainMode(app, '/api/playback-options/replay-gain-mode'); // ?mode
controllingPlaybackRoutes.GET_previous(app, '/api/controlling-playback/previous');
controllingPlaybackRoutes.GET_next(app, '/api/controlling-playback/next');
controllingPlaybackRoutes.GET_stop(app, '/api/controlling-playback/stop');
controllingPlaybackRoutes.GET_pause(app, '/api/controlling-playback/pause'); // ?state
controllingPlaybackRoutes.GET_seek(app, '/api/controlling-playback/seek'); // ?songPos &time
controllingPlaybackRoutes.GET_seekId(app, '/api/controlling-playback/seek-id'); // ?songId &time
controllingPlaybackRoutes.GET_play(app, '/api/controlling-playback/play'); // ?songPos
controllingPlaybackRoutes.GET_playId(app, '/api/controlling-playback/play-id'); // ?songId
controllingPlaybackRoutes.GET_seekCur(app, '/api/controlling-playback/seek-cur'); // ?time

const { host, port, publicDir } = config;

// serve public
if (publicDir) {
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
const server = app.listen(port, host, () => {
  log.info(`[express] express listening on ${host}:${port}`);
});

// add socketio
const io = new SocketIO(server);
io.on('connection', (socket) => {
  log.info('[socketio] client connected');
  mpdIdler.addListener((subsystem, at) => {
    io.emit('idle', { subsystem, at }); // broadcast to everyone
    log.info(`[socketio] idle message for subsystem "${subsystem}"`);
  });
  socket.on('disconnect', () => {
    log.info('[socketio] client disconnected');
  });
});
