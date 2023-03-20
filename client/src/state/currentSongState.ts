/** Current song data, which MAY be fuzzy (think of mp3v2 tags or arbitrary metadata fields). */
export interface ICurrentSong {
  file: string;
  lastModified?: string;
  title?: string;
  time?: number;
  duration?: number;
  name?: string;
  pos: number;
  id: number;
  /** server calculated "artist - song" text */
  formattedName: string;
  /** our own is liked flag */
  liked: boolean;
}

export const getInitialCurrentSongState = (): ICurrentSong => ({
  file: '',
  pos: -1,
  id: -1,
  formattedName: '',
  liked: false,
});
