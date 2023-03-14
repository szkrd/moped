import { getCurrentSongName } from '../utils/mpd';
import { SchemaType, toSchema } from '../utils/schema';

// cleans up song data coming from mpd
function normalizeCurrentSong(resp: any) {
  const ret: any = toSchema(resp, {
    [SchemaType.Number]: ['id', 'pos', 'time', 'duration', 'track', 'disc'],
  });
  Object.assign(ret, { formattedName: getCurrentSongName(ret) });
  return ret;
}

export const status = {
  normalizeCurrentSong,
};
