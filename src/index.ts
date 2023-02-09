import 'dotenv/config';
import express from 'express';
import { MpdCommand } from './models/mpdCommand';
import { toMpdCurrentSong } from './models/mpdResponse/status/currentSong';
import { toMpdStats } from './models/mpdResponse/status/stats';
import { toMpdStatus } from './models/mpdResponse/status/status';
import { config } from './modules/config';
import { log } from './modules/log';
import { mpd } from './modules/mpd';
import { parseKeyValueMessage } from './utils/mpd';
import { onExit } from './utils/process';

mpd.connect();
onExit(() => {
  mpd.disconnect();
});

const app = express();
app.use(express.json());

app.get('/status/current-song', async (req, res) => {
  mpd
    .sendCommand(MpdCommand.CurrentSong)
    .then((resp) => {
      res.json(toMpdCurrentSong(parseKeyValueMessage(resp)));
    })
    .catch((error) => {
      res.status(500).json({ status: 500, error });
    });
});

app.get('/status/status', async (req, res) => {
  mpd
    .sendCommand(MpdCommand.Status)
    .then((resp) => {
      res.json(toMpdStatus(parseKeyValueMessage(resp)));
    })
    .catch((error) => {
      res.status(500).json({ status: 500, error });
    });
});

app.get('/status/stats', async (req, res) => {
  mpd
    .sendCommand(MpdCommand.Stats)
    .then((resp) => {
      res.json(toMpdStats(parseKeyValueMessage(resp)));
    })
    .catch((error) => {
      res.status(500).json({ status: 500, error });
    });
});

// fallback if no other route handler matches the request
app.use((_, res) => {
  res.status(404);
  res.json({ error: 'Not found' });
});

const { host, port } = config;

app.listen(port, host, () => {
  log.info(`Express listening on ${host}:${port}`);
});
