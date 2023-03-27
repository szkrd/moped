import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import 'modern-normalize';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.scss';
import { setupSocketIo } from './modules/socketIo';
import { router } from './router';

dayjs.extend(dayjsRelativeTime);
dayjs.extend(dayjsDuration);
setupSocketIo();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
