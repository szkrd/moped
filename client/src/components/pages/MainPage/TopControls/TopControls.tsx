import { range } from 'lodash';
import { FC, useCallback } from 'react';
import { Heart, Pause, Play, SkipBack, SkipForward, Square, Volume2 } from 'react-feather';
import { useAppState } from '../../../../hooks/useAppState';
import {
  apiCallInProgress,
  apiGetActionPause,
  apiGetActionPlay,
  apiGetActionStop,
  apiGetStatus,
  apiPostLikeSong,
  ApiUrl,
} from '../../../../modules/api';
import { ICurrentSongState } from '../../../../state/currentSongState';
import { IStatusState } from '../../../../state/statusState';
import { HTTPMethod } from '../../../../utils/fetch/request';
import { ApiButton } from '../../../common/ApiButton/ApiButton';
import { Button } from '../../../common/Button/Button';
import { ButtonBar } from '../../../common/ButtonBar/ButtonBar';
import LoadIndicator from '../../../common/LoadIndicator/LoadIndicator';
import { SearchButton } from '../../../common/SearchButton/SearchButton';
import styles from './TopControls.module.scss';
import { VolumeButton } from './VolumeButton/VolumeButton';

export const TopControls: FC = () => {
  const apiCalls = useAppState((state) => state.api.calls);
  const callCount = apiCalls.length;
  const status = useAppState<IStatusState>((state) => state.status);
  const currentSong = useAppState<ICurrentSongState>((state) => state.currentSong);
  const { formattedName } = currentSong;

  const onLikeClick = useCallback(() => apiPostLikeSong(currentSong), [currentSong]);
  const onVolumeClick = useCallback(() => apiGetStatus(), []);

  const isStatusLoading = apiCallInProgress(apiCalls, ApiUrl.Status);
  return (
    <div className={styles.topControls}>
      <ButtonBar>
        <div className={styles.groupButtons}>
          <Button className={styles.wide} onClick={onVolumeClick} disabled={isStatusLoading}>
            <Volume2 />
          </Button>
          {range(11).map((idx) => (
            <VolumeButton value={idx} volume={status.volume} key={idx} />
          ))}
        </div>
        <Button
          onClick={apiGetActionStop}
          disabled={apiCallInProgress(apiCalls, ApiUrl.Stop)}
          selected={status.state === 'stop'}
        >
          <Square />
        </Button>
        <ApiButton url={ApiUrl.Previous} disabled={apiCallInProgress(apiCalls, ApiUrl.Previous)}>
          <SkipBack />
        </ApiButton>
        <ApiButton url={ApiUrl.Next} disabled={apiCallInProgress(apiCalls, ApiUrl.Next)}>
          <SkipForward />
        </ApiButton>
        <Button
          onClick={apiGetActionPause}
          disabled={apiCallInProgress(apiCalls, ApiUrl.Pause)}
          selected={status.state === 'pause'}
        >
          <Pause />
        </Button>
        <Button
          onClick={apiGetActionPlay}
          disabled={apiCallInProgress(apiCalls, ApiUrl.Play)}
          selected={status.state === 'play'}
        >
          <Play />
        </Button>
        <Button
          selected={currentSong.liked}
          onClick={onLikeClick}
          disabled={apiCallInProgress(apiCalls, ApiUrl.Like, HTTPMethod.Post)}
        >
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
