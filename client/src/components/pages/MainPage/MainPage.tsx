import { FC } from 'react';
import { Outlet, useHref, useLocation } from 'react-router-dom';
import { ITabSelectorTab, TabSelector } from '../../common/TabSelector/TabSelector';
import { CurrentSongTitle } from './CurrentSongTitle/CurrentSongTitle';
import { TopControls } from './TopControls/TopControls';

const TABS: ITabSelectorTab[] = [
  { name: 'all stats', url: 'stats', selected: false },
  { name: 'favorites', url: 'favorites', selected: false },
  { name: 'history', url: 'history', selected: false },
];

const RouteBasedTabSelector: FC = () => {
  const { pathname } = useLocation();
  const trimmedPathname = pathname.replace(/^\//, '');
  TABS.forEach((tab) => (tab.selected = trimmedPathname === tab.url));
  return <TabSelector tabs={TABS} />;
};

export const MainPage: FC = () => {
  return (
    <div>
      <TopControls />
      <CurrentSongTitle />
      <RouteBasedTabSelector />
      <Outlet />
    </div>
  );
};
