import { parseKeyValueMessage } from '../../../utils/mpd';
import { SchemaType, toSchema } from '../../../utils/schema';

/**
 * Current song metadata, which can be pretty much anything
 * (depending on the file format's metadata capabilities),
 * apart from id and pos.
 * TODO: add from https://mpd.readthedocs.io/en/latest/protocol.html#tags
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
  /**
   * The time stamp of the last modification of the underlying file in ISO 8601 format.
   * Example: `2008-09-28T20:04:57Z`
   */
  lastModified?: string;
  /**
   * Like duration, but as integer value
   * @deprecated it is only here for compatibility with older clients. Do not use.
   */
  time?: number;
  /** The duration of the song in seconds; may contain a fractional part.*/
  duration?: number;
  /**
   * If this is a queue item referring only to a portion of the song file,
   * then this attribute contains the time range in the form START-END or
   * START- (open ended); both START and END are time stamps within the song in seconds
   * (may contain a fractional part). Example: 60-120 plays only the second minute;
   * 180 skips the first three minutes.
   */
  range?: string;
  /**
   * Meta title; if it's missing, there's a very good chance that
   * you will have to fallback to parsing the filename.
   */
  title?: string;
  /**
   * The audio format of the song (or an approximation to a format supported by MPD and the decoder plugin being used).
   * When playing this file, the audio value in the status response should be the same.
   */
  format?: string;
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

export function toMpdCurrentSong(text: string) {
  const obj = parseKeyValueMessage(text);
  return toSchema<IMpdCurrentSong>(obj, {
    [SchemaType.Number]: ['id', 'pos', 'time', 'duration', 'track', 'disc'],
  });
}
