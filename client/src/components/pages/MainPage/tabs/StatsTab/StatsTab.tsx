import { FC } from 'react';
import { useAppState } from '../../../../../hooks/useAppState';
import { IAppState } from '../../../../../state/appState';
import { MpdJsonRenderer } from '../../../../common/MpdJsonRenderer/MpdJsonRenderer';
import styles from '../tabs.module.scss';

const JsonStore: FC<{ section: keyof IAppState }> = ({ section }) => {
  const data = useAppState<any>((state) => state[section]);
  if (section === 'idleSubsystem' && data.uninitialized) return null;
  return <MpdJsonRenderer data={data} />;
};

export const StatsTab: FC = () => {
  return (
    <div className={styles.tabPage}>
      <JsonStore section="currentSong" />
      <JsonStore section="stats" />
      <JsonStore section="status" />
      <JsonStore section="idleSubsystem" />
    </div>
  );
};
