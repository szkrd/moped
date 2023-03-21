import { FC } from 'react';
import { useAppState } from '../../../../../hooks/useAppState';
import { ICurrentSongState } from '../../../../../state/currentSongState';
import { IStatsState } from '../../../../../state/statsState';
import { IStatusState } from '../../../../../state/statusState';
import { MpdJsonRenderer } from '../../../../common/MpdJsonRenderer/MpdJsonRenderer';

export const StatsTab: FC = () => {
  // instead of react router's useLoaderData we connect directly to the store
  const stats = useAppState<IStatsState>((state) => state.stats);
  const currentSong = useAppState<ICurrentSongState>((state) => state.currentSong);
  const status = useAppState<IStatusState>((state) => state.status);
  return (
    <div>
      <MpdJsonRenderer data={currentSong as any} />
      <MpdJsonRenderer data={stats as any} />
      <MpdJsonRenderer data={status as any} />
    </div>
  );
};
