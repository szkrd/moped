export interface IStatusState {
  volume: number;
  repeat: boolean;
  random: boolean;
  single: boolean;
  consume: boolean;
  playlist: number;
  playlistLength: number;
  mixrampDb: number;
  state: 'play' | 'stop' | 'pause';
  song: number;
  songId: number;
  duration?: number;
  /** @deprecated */
  time?: string;
  elapsed: number;
  bitrate: number;
  /** in samplerate:bits:channels format */
  audio: string;
  nextSong: number;
  nextSongId: number;
  xfade?: number;
  updatingDb?: number;
  error?: string;
}

export const getInitialStatusState = (): IStatusState => ({
  volume: -1,
  repeat: false,
  random: false,
  single: false,
  consume: false,
  playlist: -1,
  playlistLength: -1,
  mixrampDb: -1,
  state: 'stop',
  song: -1,
  songId: -1,
  elapsed: -1,
  bitrate: -1,
  audio: '',
  nextSong: -1,
  nextSongId: -1,
});
