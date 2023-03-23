import { FC } from 'react';
import { useAppState } from '../../../../../hooks/useAppState';
import { IHistoryState } from '../../../../../state/historyState';
import { SongList } from '../../../../common/SongList/SongList';

export const HistoryTab: FC = () => {
  const favorites = useAppState<IHistoryState>((state) => state.history);
  const { songs } = favorites;
  return (
    <div>
      <SongList songs={songs} />
    </div>
  );
};
