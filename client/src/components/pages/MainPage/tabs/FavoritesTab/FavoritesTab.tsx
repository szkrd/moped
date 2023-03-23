import React, { FC } from 'react';
import { useAppState } from '../../../../../hooks/useAppState';
import { IFavoritesState } from '../../../../../state/favoritesState';
import { SongList } from '../../../../common/SongList/SongList';

export const FavoritesTab: FC = () => {
  const favorites = useAppState<IFavoritesState>((state) => state.favorites);
  const { songs } = favorites;
  return (
    <div>
      <SongList songs={songs} />
    </div>
  );
};
