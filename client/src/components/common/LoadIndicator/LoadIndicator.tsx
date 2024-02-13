import { range } from 'lodash';
import { FC } from 'react';
import styles from './LoadIndicator.module.scss';
import classNames from 'classnames';

interface ILoadIndicator {
  active?: boolean;
}

const LoadIndicator: FC<ILoadIndicator> = ({ active }) => {
  return (
    <div className={classNames(styles.wrapper, styles[active ? 'active' : 'inactive'])}>
      <div className={styles.loadIndicator}>
        {range(9).map((idx) => (
          <div key={idx} />
        ))}
      </div>
    </div>
  );
};

export default LoadIndicator;
