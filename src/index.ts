import 'dotenv/config';
import express from 'express';
import { MpdCommand } from './models/mpdCommand';
import { config } from './modules/config';
import { log } from './modules/log';
import { mpd } from './modules/mpd';
import { controllingPlaybackRoutes } from './routes/controllingPlaybackRoutes';
import { playbackOptionsRoutes } from './routes/playbackOptionsRoutes';
import { statusRoutes } from './routes/statusRoutes';
import { parseKeyValueMessage } from './utils/mpd';
import { onExit } from './utils/process';
import { SchemaType, toSchema } from './utils/schema';

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
playbackOptionsRoutes.GET_volume(app, '/playback-options/volume');
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
