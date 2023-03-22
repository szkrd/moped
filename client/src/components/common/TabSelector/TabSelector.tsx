import { FC } from 'react';
import { Button } from '../Button/Button';
import styles from './TabSelector.module.scss';

export interface ITabSelectorTab {
  url: string;
  name: string;
  selected: boolean;
}

interface ITabSelector {
  tabs: ITabSelectorTab[];
}

export const TabSelector: FC<ITabSelector> = ({ tabs }) => {
  return (
    <div>
      <div className={styles.tabButtons}>
        {tabs.map((tab) => (
          <Button url={tab.url} key={tab.url} className={styles.tabButton} selected={tab.selected}>
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
