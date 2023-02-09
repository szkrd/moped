import { SchemaType, toSchema } from '../../../utils/schema';

/**
 * Current song metadata, which can be pretty much anything
 * (depending on the file format's metadata capabilities),
 * apart from id and pos.
 */
export interface IMpdCurrentSong extends Record<string, string | number | undefined> {
  id: number;
  pos: number;
  /**
   * 1. Name of the current file WITH the absolute (mpd) path
   *    - "file: INCOMING/Draconian - Under A Godless Veil/01 Sorrow Of Sophia.mp3"
   *    - "INCOMING/Blackmores Night/2003 - Ghost of a Rose/01 - Way To Mandalay.mp3"
   * 2. Url of the current stream.
   *    - "file: http://igor.torontocast.com:1710/;"
   *    - "file: http://23.29.71.154:8226/stream"
   */
  file?: string;
  lastModified?: string;
  time?: number;
  duration?: number;
  /**
   * Meta title; if it's missing, there's a very good chance that
   * you will have to fallback to parsing the filename.
   */
  title?: string;
  artist?: string;
  composer?: string;
  albumArtist?: string;
  album?: string;
  track?: number;
  disc?: number;
  /**
   * So far as a string, not sure if it will always be the year in a YYYY format, but it seems to be the case.
   * @see https://docs.mp3tag.de/mapping/
   */
  date?: string;
  genre?: string;
  /**
   * 1. Name of the current song.
   * 2. Missing if the file (or stream) has no metadata about the song.
   */
  name?: string;
}

export function toMpdCurrentSong(obj: Record<string, string>) {
  return toSchema<IMpdCurrentSong>(obj, {
    [SchemaType.Number]: ['id', 'pos', 'time', 'duration', 'track', 'disc'],
  });
}
