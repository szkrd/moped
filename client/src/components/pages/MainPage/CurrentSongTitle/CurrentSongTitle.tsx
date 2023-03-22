import { FC } from 'react';
import { useAppState } from '../../../../hooks/useAppState';
import styles from './CurrentSongTitle.module.scss';

export const CurrentSongTitle: FC = () => {
  const formattedName = useAppState<string>((state) => state.currentSong.formattedName);
  return <h2 className={styles.currentSongTitle}>{formattedName}</h2>;
};
