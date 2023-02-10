import { parseKeyValueMessage } from '../../../utils/mpd';
import { SchemaType, toSchema } from '../../../utils/schema';

export interface IMpdStats {
  /** Number of artists */
  artists: number;
  /** Number of albums */
  albums: number;
  /** Number of songs */
  songs: number;
  /** Daemon uptime in seconds */
  uptime: number;
  /** Sum of all song times in the database in seconds */
  dbPlaytime: number;
  /** Last db update in UNIX time (seconds since 1970-01-01 UTC) */
  dbUpdate: number;
  /** Time length of music played */
  playtime: number;
}

export function toMpdStats(text: string) {
  const obj = parseKeyValueMessage(text);
  return toSchema<IMpdStats>(obj, {
    [SchemaType.Number]: '*',
  });
}
