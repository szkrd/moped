import { debounce } from 'lodash';
import { io } from 'socket.io-client';
import { config } from './config';

const SIO_DEBOUNCE = 1000;

export function setupSocketIo() {
  // TODO https://socket.io/docs/v3/handling-cors/
  return false;
  const socket = io(config.socketIoUrl);
  console.log('1>>>', socket);
  socket.on(
    'idle',
    debounce((data) => {
      console.log('idle message >>>', data);
      // updateJsonDataUi('idle', data);
      // if (['player', 'playlist'].includes(data.subsystem)) {
      //   refreshStats('current-song');
      //   refreshHistory();
      // }
      // if (['mixer'].includes(data.subsystem)) {
      //   refreshStats('status');
      // }
    }, SIO_DEBOUNCE)
  );
}
