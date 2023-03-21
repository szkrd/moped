import { addDefaultUriProtocol } from '../utils/url/addDefaultUriProtocol';

const apiUrl = addDefaultUriProtocol(import.meta.env.VITE_API_URL || '127.0.0.1:8080');
const socketIoUrl = addDefaultUriProtocol(import.meta.env.VITE_SOCKETIO_URL || '127.0.0.1:8080');

export const config = {
  apiUrl,
  socketIoUrl,
};
