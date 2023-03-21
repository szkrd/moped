import 'modern-normalize';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './components/pages/MainPage/MainPage';
import { FavoritesTab } from './components/pages/MainPage/tabs/FavoritesTab/FavoritesTab';
import { HistoryTab } from './components/pages/MainPage/tabs/HistoryTab/HistoryTab';
import { StatsTab } from './components/pages/MainPage/tabs/StatsTab/StatsTab';
import './index.scss';
import { appState } from './state/appState';
import { request } from './utils/fetch/request';

const router = createHashRouter([
  {
    path: '/',
    element: <MainPage />,
    // loader: rootLoader,
    children: [
      {
        path: 'stats',
        loader: async () => {
          const resp = await request('/status/stats');
          appState.update((state) => {
            state.stats = resp;
          });
          console.log('1>>>', 'setting state?', appState._get());
          setTimeout(() => {
            console.log('TIMEOUT>>>');
            appState.update((state) => {
              state.stats.uptime = -123456;
            });
          }, 3000);
          // setStatsState(getCurrentStateSetter(), resp);
          // console.log('2>>>', resp, getAppStoreState());
          return resp;
        },
        element: <StatsTab />,
      },
      {
        path: 'favorites',
        element: <FavoritesTab />,
      },
      {
        path: 'history',
        element: <HistoryTab />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
