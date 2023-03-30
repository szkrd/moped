import 'dotenv/config';
import { parseIntSafe } from '../utils/number';

export const config = {
  appName: 'moped', // package.json is above the typescript root,
  host: process.env.HOST ?? '127.0.0.1',
  port: parseIntSafe(process.env.PORT, 8080),
  logLevel: parseIntSafe(process.env.LOG_LEVEL, 0),
  publicDir: process.env.PUBLIC_DIR ?? '',
  maxHistory: parseIntSafe(process.env.MAX_HISTORY, 20),
  cors: {
    origin: process.env.CORS_ORIGIN ?? '*',
  },
  mpd: {
    host: process.env.MPD_HOST ?? '127.0.0.1',
    port: parseIntSafe(process.env.MPD_PORT, 6600),
  },
};

if (config.cors.origin === 'false') config.cors = undefined;
