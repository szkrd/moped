import { parseKeyValueMessage } from '../../../utils/mpd';
import { SchemaType, toSchema } from '../../../utils/schema';

export interface IMpdStatus {
  /** the name of the current partition (see Partition commands) */
  partition?: string;
  /**
   * 0-100
   * @deprecated -1 if the volume cannot be determined
   */
  volume: number;
  /** 0 or 1 */
  repeat: boolean;
  /** 0 or 1 */
  random: boolean;
  /** : 0, 1 or oneshot */
  single: boolean | 'oneshot' | null;
  /** : 0, 1 or oneshot(Since MPD 0.24) */
  consume: boolean | 'oneshot' | null;

  /** 31-bit unsigned integer, the playlist version number */
  playlist: number;
  /** integer, the length of the playlist */
  playlistLength: number;
  /** play, stop, or pause */
  state: 'play' | 'stop' | 'pause';
  /** playlist song number of the current song stopped on or playing */
  song: number;
  /** playlist songid of the current song stopped on or playing */
  songId: number;
  /** : playlist song number of the next song to be played */
  nextSong?: number;
  /** : playlist songid of the next song to be played */
  nextSongId?: number;
  /**
   * total time elapsed (of current playing/paused song) in seconds
   * @deprecated use elapsed instead
   */
  time: string;
  /** : Total time elapsed within the current song in seconds, but with higher resolution. */
  elapsed: number;
  /** : Duration of the current song in seconds. */
  duration?: number;
  /** instantaneous bitrate in kbps */
  bitrate: number;
  /** crossfade in seconds (see Cross-Fading) */
  xfade?: number;
  /** mixramp threshold in dB */
  mixrampDb?: number;
  /** mixrampdelay in seconds */
  mixrampDelay?: number;
  /** The format emitted by the decoder plugin during playback, format: samplerate:bits:channels. See Global Audio Format for a detailed explanation. */
  audio: string;
  /** job id */
  updatingDb?: string;
  /** if there is an error, returns message here */
  error?: string;
}

export function toMpdStatus(text: string) {
  const obj = parseKeyValueMessage(text);
  return toSchema<IMpdStatus>(obj, {
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
  });
}
