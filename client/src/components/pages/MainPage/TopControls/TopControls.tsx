import { range } from 'lodash';
import { FC, useCallback } from 'react';
import { Heart, Pause, Play, SkipBack, SkipForward, Square, Volume2 } from 'react-feather';
import { useAppState } from '../../../../hooks/useAppState';
import { apiPostLikeCurrentSong } from '../../../../modules/api';
import { ICurrentSongState } from '../../../../state/currentSongState';
import { IStatusState } from '../../../../state/statusState';
import { ApiButton } from '../../../common/ApiButton/ApiButton';
import { Button } from '../../../common/Button/Button';
import { ButtonBar } from '../../../common/ButtonBar/ButtonBar';
import styles from './TopControls.module.scss';

export const TopControls: FC = () => {
  const status = useAppState<IStatusState>((state) => state.status);
  const currentSong = useAppState<ICurrentSongState>((state) => state.currentSong);
  const roundedVol = Math.round(status.volume / 10);
  const onLikeClick = useCallback(() => apiPostLikeCurrentSong(currentSong), [currentSong]);
  return (
    <div className={styles.topControls}>
      <ButtonBar>
        <div className={styles.groupButtons}>
          <Button className={styles.wide}>
            <Volume2 />
          </Button>
          {range(11).map((idx) => (
            <ApiButton url={`/playback-options/volume?vol=${idx * 10}`} key={idx} selected={roundedVol === idx}>
              {idx}
            </ApiButton>
          ))}
        </div>
        <ApiButton url="/controlling-playback/stop" selected={status.state === 'stop'}>
          <Square />
        </ApiButton>
        <ApiButton url="/controlling-playback/previous">
          <SkipBack />
        </ApiButton>
        <ApiButton url="/controlling-playback/next">
          <SkipForward />
        </ApiButton>
        <ApiButton url="/controlling-playback/pause" selected={status.state === 'pause'}>
          <Pause />
        </ApiButton>
        <ApiButton url="/controlling-playback/play" selected={status.state === 'play'}>
          <Play />
        </ApiButton>
        <Button selected={currentSong.liked} onClick={onLikeClick}>
          <Heart />
        </Button>
      </ButtonBar>
    </div>
  );
};
