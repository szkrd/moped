import { FC } from 'react';
import { Button } from '../Button/Button';
import styles from './TabSelector.module.scss';

export interface ITabSelectorTab {
  url: string;
  name: string;
  selected: boolean;
}

interface ITabSelector {
  led?: boolean;
  tabs: ITabSelectorTab[];
}

export const TabSelector: FC<ITabSelector> = ({ tabs, led }) => {
  return (
    <div>
      <div className={styles.tabButtons}>
        {tabs.map((tab) => (
          <Button
            url={tab.url}
            key={tab.url}
            className={styles.tabButton}
            selected={tab.selected}
            selectedClassName={styles.tabButtonSelected}
          >
            {led && <b className={styles.led}></b>}
            <span>{tab.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
