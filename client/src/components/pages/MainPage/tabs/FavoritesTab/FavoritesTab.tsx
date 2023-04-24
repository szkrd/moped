import React, { FC } from 'react';
import { useAppState } from '../../../../../hooks/useAppState';
import { apiDeleteLikedSong } from '../../../../../modules/api';
import { IFavoritesState, IPartialStoredSong } from '../../../../../state/favoritesState';
import { SongList } from '../../../../common/SongList/SongList';
import styles from '../tabs.module.scss';

const removeSong = (song: IPartialStoredSong) => {
  if (song.id) apiDeleteLikedSong(song.id);
};

export const FavoritesTab: FC = () => {
  const favorites = useAppState<IFavoritesState>((state) => state.favorites);
  const { songs } = favorites;
  return (
    <div className={styles.tabPage}>
      <SongList songs={songs} onRemoveClick={removeSong} withComments withDownloadedFlag />
    </div>
  );
};
