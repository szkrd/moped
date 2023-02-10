import { Express } from 'express';
import { MpdCommand } from '../models/mpdCommand';
import { mpd } from '../modules/mpd';
import { catchMpdError } from '../utils/error';

function GET_previous(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    mpd
      .sendCommand(MpdCommand.Previous)
      .then(() => res.json({ success: true }))
      .catch(catchMpdError(res));
  });
}

function GET_next(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    mpd
      .sendCommand(MpdCommand.Next)
      .then(() => res.json({ success: true }))
      .catch(catchMpdError(res));
  });
}

function GET_stop(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    mpd
      .sendCommand(MpdCommand.Stop)
      .then(() => res.json({ success: true }))
      .catch(catchMpdError(res));
  });
}

export const controllingPlaybackRoutes = {
  GET_previous,
  GET_next,
  GET_stop,
};
