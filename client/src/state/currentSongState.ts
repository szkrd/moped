import { IFromApi } from './apiState';

/**
 * Current song data, which MAY be fuzzy (think of mp3v2 tags or
 * arbitrary metadata fields); see: https://docs.mp3tag.de/mapping/
 * I tried collecting the ones that I could see in my collection.
 */
export interface ICurrentSongState extends IFromApi {
  file: string;
  pos: number;
  id: number;
  /** server calculated "artist - song" text */
  formattedName: string;
  /** our own is liked flag */
  liked: boolean;
  // optionals
  lastModified?: string;
  title?: string;
  time?: number;
  duration?: number;
  name?: string;
  album?: string;
  date?: string;
  genre?: string;
  artist?: string;
  albumArtist?: string;
  performer?: string;
  publisher?: string;
  label?: string;
  subtitle?: string;
  composer?: string;
  conductor?: string;
  track?: number;
  disc?: number;
  bpm?: number;
  catalogNumber?: number;
  comment?: string;
  description?: string;
  language?: string;
  mood?: string;
}

export const getInitialCurrentSongState = (): ICurrentSongState => ({
  uninitialized: true,
  file: '',
  pos: -1,
  id: -1,
  formattedName: '',
  liked: false,
});
