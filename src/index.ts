import 'dotenv/config';
import express from 'express';
import { config } from './modules/config';
import { log } from './modules/log';
import { mpd } from './modules/mpd';
import { onExit } from './utils/process';

mpd.connect();
onExit(() => {
  mpd.disconnect();
});

const app = express();
app.use(express.json());

app.get('/test', async (req, res) => {
  res.json({ hello: 'world' });
});

const { host, port } = config;

app.listen(port, host, () => {
  log.info(`Express listening on ${host}:${port}`);
});
