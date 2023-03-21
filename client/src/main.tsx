import 'modern-normalize';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './components/pages/MainPage/MainPage';
import { FavoritesTab } from './components/pages/MainPage/tabs/FavoritesTab/FavoritesTab';
import { HistoryTab } from './components/pages/MainPage/tabs/HistoryTab/HistoryTab';
import { StatsTab } from './components/pages/MainPage/tabs/StatsTab/StatsTab';
import './index.scss';
import { apiGetAllStats } from './modules/api';

const router = createHashRouter([
  {
    path: '/',
    element: <MainPage />,
    // loader: rootLoader,
    children: [
      {
        path: 'stats',
        loader: () => {
          apiGetAllStats();
          return null;
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
