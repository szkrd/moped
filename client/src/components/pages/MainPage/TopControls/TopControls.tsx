import { range } from 'lodash';
import { FC } from 'react';
import { Pause, Play, SkipBack, SkipForward, Square, Volume2, Heart } from 'react-feather';
import { ApiButton } from '../../../common/ApiButton/ApiButton';
import { Button } from '../../../common/Button/Button';
import { ButtonBar } from '../../../common/ButtonBar/ButtonBar';
import styles from './TopControls.module.scss';

export const TopControls: FC = () => {
  return (
    <ButtonBar>
      <div className={styles.groupButtons}>
        <Button className={styles.wide}>
          <Volume2 />
        </Button>
        {range(11).map((idx) => (
          <ApiButton url={`/playback-options/volume?vol=${idx * 10}`} key={idx}>
            {idx}
          </ApiButton>
        ))}
      </div>
      <ApiButton url="/controlling-playback/stop">
        <Square />
      </ApiButton>
      <ApiButton url="/controlling-playback/previous">
        <SkipBack />
      </ApiButton>
      <ApiButton url="/controlling-playback/next">
        <SkipForward />
      </ApiButton>
      <ApiButton url="/controlling-playback/pause">
        <Pause />
      </ApiButton>
      <ApiButton url="/controlling-playback/play">
        <Play />
      </ApiButton>
      <Button>
        <Heart />
      </Button>
    </ButtonBar>
  );
};
