import { IFromApi } from './apiState';
import { ICurrentSongState } from './currentSongState';

/** Describes the output of the normalizeSongData on backend */
export interface IStoredSong extends Omit<ICurrentSongState, 'pos' | 'duration' | 'time' | 'lastModified' | 'liked'> {
  location: string;
  at: string;
}

export interface IFavoritesState extends IFromApi {
  songs: IStoredSong[];
}

export const getInitialFavoritesState = (): IFavoritesState => ({
  uninitialized: true,
  songs: [],
});
