import { debounce } from 'lodash';
import { io } from 'socket.io-client';
import { appState } from '../state/appState';
import { apiGetAllStats, apiGetStatus } from './api';
import { config } from './config';

const SIO_DEBOUNCE = 1000;

export function setupSocketIo() {
  const socket = io(config.socketIoUrl);
  socket.on(
    'idle',
    debounce((data) => {
      appState.update((state) => (state.idleSubsystem = data));
      if (['player', 'playlist'].includes(data.subsystem)) {
        apiGetAllStats();
        // TODO: refreshHistory();
      }
      if (['mixer'].includes(data.subsystem)) {
        apiGetStatus(); // status also has the volume info
      }
    }, SIO_DEBOUNCE)
  );
}
