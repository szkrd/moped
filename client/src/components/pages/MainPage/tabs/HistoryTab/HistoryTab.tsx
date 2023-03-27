import { FC } from 'react';
import { useAppState } from '../../../../../hooks/useAppState';
import { apiPostLikeSong } from '../../../../../modules/api';
import { IPartialStoredSong } from '../../../../../state/favoritesState';
import { IHistoryState } from '../../../../../state/historyState';
import { SongList } from '../../../../common/SongList/SongList';
import styles from '../tabs.module.scss';

const likeSong = (song: IPartialStoredSong) => {
  apiPostLikeSong(song);
};

export const HistoryTab: FC = () => {
  const favorites = useAppState<IHistoryState>((state) => state.history);
  const { songs } = favorites;
  return (
    <div className={styles.tabPage}>
      <SongList songs={songs} onLikeClick={likeSong} />
    </div>
  );
};
