import { FC } from 'react';
import Button from '../Button/Button';
import styles from './TabSelector.module.scss';

export interface ITabSelectorTab {
  url: string;
  name: string;
}

interface ITabSelector {
  tabs: ITabSelectorTab[];
}

const TabSelector: FC<ITabSelector> = ({ tabs }) => {
  return (
    <div>
      <div className={styles.tabButtons}>
        {tabs.map((tab) => (
          <Button url={tab.url} key={tab.url} className={styles.tabButton}>
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TabSelector;
