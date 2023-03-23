import dayjs from 'dayjs';
import 'modern-normalize';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './components/pages/MainPage/MainPage';
import { FavoritesTab } from './components/pages/MainPage/tabs/FavoritesTab/FavoritesTab';
import { HistoryTab } from './components/pages/MainPage/tabs/HistoryTab/HistoryTab';
import { StatsTab } from './components/pages/MainPage/tabs/StatsTab/StatsTab';
import './index.scss';
import { apiGetAllStats, apiGetFavorites, apiGetHistory } from './modules/api';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import dayjsDuration from 'dayjs/plugin/duration';
import { setupSocketIo } from './modules/socketIo';

dayjs.extend(dayjsRelativeTime);
dayjs.extend(dayjsDuration);
setupSocketIo();

const getLoader = (fn: () => Promise<void>) => () => {
  fn();
  return null;
};

const router = createHashRouter([
  {
    path: '/',
    element: <MainPage />,
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
