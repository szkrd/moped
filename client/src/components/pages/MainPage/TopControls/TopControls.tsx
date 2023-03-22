import { range } from 'lodash';
import { FC, useCallback } from 'react';
import { Heart, Pause, Play, SkipBack, SkipForward, Square, Volume2 } from 'react-feather';
import { useAppState } from '../../../../hooks/useAppState';
import { apiGetStatus, apiPostLikeCurrentSong, ApiUrl } from '../../../../modules/api';
import { ICurrentSongState } from '../../../../state/currentSongState';
import { IStatusState } from '../../../../state/statusState';
import { ApiButton } from '../../../common/ApiButton/ApiButton';
import { Button } from '../../../common/Button/Button';
import { ButtonBar } from '../../../common/ButtonBar/ButtonBar';
import LoadIndicator from '../../../common/LoadIndicator/LoadIndicator';
import { SearchButton } from '../../../common/SearchButton/SearchButton';
import styles from './TopControls.module.scss';
import { VolumeButton } from './VolumeButton/VolumeButton';

export const TopControls: FC = () => {
  const callCount = useAppState<number>((state) => state.api.callCount);
  const status = useAppState<IStatusState>((state) => state.status);
  const currentSong = useAppState<ICurrentSongState>((state) => state.currentSong);
  const { formattedName } = currentSong;
  const onLikeClick = useCallback(() => apiPostLikeCurrentSong(currentSong), [currentSong]);
  const onVolumeClick = useCallback(() => apiGetStatus(), []);
  return (
    <div className={styles.topControls}>
      <ButtonBar>
        <div className={styles.groupButtons}>
          <Button className={styles.wide} onClick={onVolumeClick}>
            <Volume2 />
          </Button>
          {range(11).map((idx) => (
            <VolumeButton value={idx} volume={status.volume} key={idx} />
          ))}
        </div>
        <ApiButton url={ApiUrl.Stop} selected={status.state === 'stop'}>
          <Square />
        </ApiButton>
        <ApiButton url={ApiUrl.Previous}>
          <SkipBack />
        </ApiButton>
        <ApiButton url={ApiUrl.Next}>
          <SkipForward />
        </ApiButton>
        <ApiButton url={ApiUrl.Pause} selected={status.state === 'pause'}>
          <Pause />
        </ApiButton>
        <ApiButton url={ApiUrl.Play} selected={status.state === 'play'}>
          <Play />
        </ApiButton>
        <Button selected={currentSong.liked} onClick={onLikeClick}>
          <Heart />
        </Button>
        <SearchButton provider="google" searchText={formattedName} />
        <SearchButton provider="youtube" searchText={formattedName} />
        <SearchButton provider="spotify" searchText={formattedName} />
        <div className={styles.spacer}></div>
        <LoadIndicator active={callCount > 0} />
      </ButtonBar>
    </div>
  );
};
