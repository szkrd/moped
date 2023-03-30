import classNames from 'classnames';
import { FC } from 'react';
import { ApiUrl } from '../../../../../modules/api';
import { ApiButton } from '../../../../common/ApiButton/ApiButton';
import styles from './VolumeButton.module.scss';

interface IVolumeButton {
  volume: number;
  value: number;
  className?: string;
}

export const VolumeButton: FC<IVolumeButton> = ({ value, volume, className }) => {
  const roundedVol = Math.round(volume / 10);
  const svgHeight = 30;
  return (
    <ApiButton
      url={ApiUrl.Volume}
      query={{ vol: value * 10 }}
      key={value}
      selected={roundedVol === value}
      className={classNames(styles.volumeButton, className)}
    >
      <label>{roundedVol === value ? value : ''}</label>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: roundedVol === value ? 0.15 : 0.25 }}
        width="24"
        height={svgHeight}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="0" y={svgHeight - value * 2 - 5} width="24" height={value * 2 + 5}></rect>
      </svg>
    </ApiButton>
  );
};
