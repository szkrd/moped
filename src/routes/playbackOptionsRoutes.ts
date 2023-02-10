import { Express } from 'express';
import { MpdCommand } from '../models/mpdCommand';
import { mpd } from '../modules/mpd';
import { catchMpdError, invalidVersionError } from '../utils/error';
import { parseKeyValueMessage } from '../utils/mpd';
import { SchemaType, toSchema } from '../utils/schema';

function GET_volume(app: Express, path: string) {
  return app.get(path, async (req, res) => {
    if (!mpd.isMinVer('0.23')) return invalidVersionError(res, '0.23');
    mpd
      .sendCommand(MpdCommand.GetVolume)
      .then((resp) => {
        const obj = parseKeyValueMessage(resp);
        res.json(toSchema(obj, { [SchemaType.Number]: ['volume'] }));
      })
      .catch(catchMpdError(res));
  });
}

export const playbackOptionsRoutes = {
  GET_volume,
};
