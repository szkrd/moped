import 'dotenv/config';
import express from 'express';
import { config } from './modules/config';
import { log } from './modules/log';
import { mpd } from './modules/mpd';
import { controllingPlaybackRoutes } from './routes/controllingPlaybackRoutes';
import { playbackOptionsRoutes } from './routes/playbackOptionsRoutes';
import { statusRoutes } from './routes/statusRoutes';
import { onExit } from './utils/process';

mpd.connect();
onExit(() => {
  mpd.disconnect();
});

const app = express();
app.use(express.json());

statusRoutes.GET_clearError(app, '/status/clear-error');
statusRoutes.GET_currentSong(app, '/status/current-song');
statusRoutes.GET_status(app, '/status/status');
statusRoutes.GET_stats(app, '/status/stats');
playbackOptionsRoutes.GET_consume(app, '/playback-options/consume'); // ?state
playbackOptionsRoutes.GET_crossfade(app, '/playback-options/crossfade'); // ?seconds
playbackOptionsRoutes.GET_mixrampDb(app, '/playback-options/mixramp-db'); // ?decibels
playbackOptionsRoutes.GET_mixrampDelay(app, '/playback-options/mixramp-delay'); // ?seconds
playbackOptionsRoutes.GET_random(app, '/playback-options/random'); // ?state
playbackOptionsRoutes.GET_repeat(app, '/playback-options/repeat'); // ?state
playbackOptionsRoutes.GET_volume(app, '/playback-options/volume'); // none or ?vol
playbackOptionsRoutes.GET_single(app, '/playback-options/single'); // ?state
playbackOptionsRoutes.GET_replayGainStatus(app, '/playback-options/replay-gain-status');
playbackOptionsRoutes.GET_replayGainMode(app, '/playback-options/replay-gain-mode'); // ?mode
controllingPlaybackRoutes.GET_previous(app, '/controlling-playback/previous');
controllingPlaybackRoutes.GET_next(app, '/controlling-playback/next');
controllingPlaybackRoutes.GET_stop(app, '/controlling-playback/stop');

// fallback if no other route handler matches the request
app.use((_, res) => {
  res.status(404);
  res.json({ error: 'Not found' });
});

const { host, port } = config;

app.listen(port, host, () => {
  log.info(`Express listening on ${host}:${port}`);
});
