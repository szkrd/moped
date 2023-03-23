import React, { FC } from 'react';
import { useAppState } from '../../../../../hooks/useAppState';
import { IFavoritesState } from '../../../../../state/favoritesState';
import { SongList } from '../../../../common/SongList/SongList';
import styles from '../tabs.module.scss';

export const FavoritesTab: FC = () => {
  const favorites = useAppState<IFavoritesState>((state) => state.favorites);
  const { songs } = favorites;
  return (
    <div className={styles.tabPage}>
      <SongList songs={songs} />
    </div>
  );
};
