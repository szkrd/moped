import { MainPage } from './components/pages/MainPage/MainPage';
import { FavoritesTab } from './components/pages/MainPage/tabs/FavoritesTab/FavoritesTab';
import { HistoryTab } from './components/pages/MainPage/tabs/HistoryTab/HistoryTab';
import { StatsTab } from './components/pages/MainPage/tabs/StatsTab/StatsTab';
import { createHashRouter } from 'react-router-dom';
import './index.scss';
import { apiGetAllStats, apiGetFavorites, apiGetHistory } from './modules/api';

export enum AppPaths {
  Root = '/',
  StatsTab = 'stats',
  FavoritesTab = 'favorites',
  HistoryTab = 'history',
}

// since react router will treat promises as async responses, and we don't want that,
// we will execute the promised api call, but return a null for the router
const getLoader = (fn: () => Promise<void> | Promise<void[]>) => () => {
  fn();
  return null;
};

export const router = createHashRouter([
  {
    path: '/',
    element: <MainPage />,
    loader: (args) => {
      const absUrl = args.request.url.replace(location.origin, '');
      return absUrl === AppPaths.StatsTab ? null : getLoader(apiGetAllStats)();
    },
    children: [
      {
        path: 'stats',
        loader: getLoader(apiGetAllStats),
        element: <StatsTab />,
      },
      {
        path: 'favorites',
        loader: getLoader(apiGetFavorites),
        element: <FavoritesTab />,
      },
      {
        path: 'history',
        element: <HistoryTab />,
        loader: getLoader(apiGetHistory),
      },
    ],
  },
]);
