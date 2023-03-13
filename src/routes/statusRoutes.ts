import { Express } from 'express';
import { getCurrentSongName } from '../utils/mpd';
import { MpdCommand } from '../models/mpdCommand';
import { mpd } from '../modules/mpd';
import { like } from '../modules/like';
import { catchMpdError, thenSuccess } from '../utils/http';
import { SchemaType, toSchema } from '../utils/schema';

function GET_clearError(app: Express, path: string) {
  return app.get(path, (req, res) => {
    mpd.sendCommand(MpdCommand.ClearError).then(thenSuccess(res)).catch(catchMpdError(res));
  });
}

function GET_currentSong(app: Express, path: string) {
  let ret: any;
  return app.get(path, (req, res) => {
    mpd
      .sendCommand(MpdCommand.CurrentSong)
      .then((resp) => {
        ret = toSchema(resp, {
          [SchemaType.Number]: ['id', 'pos', 'time', 'duration', 'track', 'disc'],
        });
        Object.assign(ret, { formattedName: getCurrentSongName(ret) });
        return like.isLiked(ret);
      })
      .then((liked) => {
        res.json({ ...ret, liked });
      })
      .catch(catchMpdError(res));
  });
}

function GET_status(app: Express, path: string) {
  return app.get(path, (req, res) => {
    mpd
      .sendCommand(MpdCommand.Status)
      .then((resp) => {
        res.json(
          toSchema(resp, {
            [SchemaType.Number]: [
              'volume',
              'elapsed',
              'duration',
              'bitrate',
              'xfade',
              'mixrampDb',
              'mixrampDelay',
              'songId',
              'song',
              'nextSong',
              'nextSongId',
              'playlist',
              'playlistLength',
            ],
            [SchemaType.Boolean]: ['repeat', 'random'],
            [SchemaType.BooleanOrOneshot]: ['single', 'consume'],
          })
        );
      })
      .catch(catchMpdError(res));
  });
}

function GET_stats(app: Express, path: string) {
  return app.get(path, (req, res) => {
    mpd
      .sendCommand(MpdCommand.Stats)
      .then((resp) => {
        res.json(
          toSchema(resp, {
            [SchemaType.Number]: '*',
          })
        );
      })
      .catch(catchMpdError(res));
  });
}

export const statusRoutes = {
  GET_clearError,
  GET_currentSong,
  GET_status,
  GET_stats,
};
