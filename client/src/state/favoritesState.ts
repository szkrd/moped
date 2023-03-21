import { IFromApi } from './apiState';
import { ICurrentSongState } from './currentSongState';

/** Describes the output of the normalizeSongData on backend */
export interface IFavoritedSong
  extends Omit<ICurrentSongState, 'pos' | 'duration' | 'id' | 'time' | 'lastModified' | 'liked'> {
  location: string;
  at: string;
}

export interface IFavoritesState extends IFromApi {
  songs: IFavoritedSong[];
}

export const getInitialFavoritesState = (): IFavoritesState => ({
  uninitialized: true,
  songs: [],
});
