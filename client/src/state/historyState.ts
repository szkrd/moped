import { IFromApi } from './apiState';
import { IStoredSong } from './favoritesState';

export interface IHistoryState extends IFromApi {
  songs: IStoredSong[];
}

export const getInitialHistoryState = (): IHistoryState => ({
  uninitialized: true,
  songs: [],
});
