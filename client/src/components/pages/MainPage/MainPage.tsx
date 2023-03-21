import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ITabSelectorTab, TabSelector } from '../../common/TabSelector/TabSelector';
import { TopControls } from './TopControls/TopControls';

const TABS: ITabSelectorTab[] = [
  { name: 'all stats', url: 'stats' },
  { name: 'favorites', url: 'favorites' },
  { name: 'history', url: 'history' },
];

export const MainPage: FC = () => {
  return (
    <div>
      <TopControls />
      <TabSelector tabs={TABS} />
      <Outlet />
    </div>
  );
};
