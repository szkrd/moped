import 'modern-normalize';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import MainPage from './components/pages/MainPage/MainPage';
import FavoritesTab from './components/pages/MainPage/tabs/FavoritesTab/FavoritesTab';
import StatsTab from './components/pages/MainPage/tabs/StatsTab/StatsTab';
import './index.scss';

const router = createHashRouter([
  {
    path: '/',
    element: <MainPage />,
    // loader: rootLoader,
    children: [
      {
        path: 'stats',
        element: <StatsTab />,
      },
      {
        path: 'favorites',
        element: <FavoritesTab />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
