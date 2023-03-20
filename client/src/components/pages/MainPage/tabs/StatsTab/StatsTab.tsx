import { FC } from 'react';
import { useAppState } from '../../../../../hooks/useAppState';
import { IStats } from '../../../../../state/statsState';

const StatsTab: FC = () => {
  // instead of react router's useLoaderData we connect directly to the store
  const stats = useAppState<IStats>((state) => state.stats);
  console.log('rerender statstab');
  return (
    <div>
      <h1>StatsTab</h1>
      <p>
        uptime: <strong>{stats.uptime}</strong>
      </p>
    </div>
  );
};

export default StatsTab;
