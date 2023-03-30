import { addDefaultUriProtocol } from '../utils/url/addDefaultUriProtocol';

// it's highly doubtful this project will ever land on a public host
const defaultProto = 'http';

const apiUrl = addDefaultUriProtocol(import.meta.env.VITE_API_URL || '127.0.0.1:8080', defaultProto);
const socketIoUrl = addDefaultUriProtocol(import.meta.env.VITE_SOCKETIO_URL || '127.0.0.1:8080', defaultProto);

export const config = {
  isDevelopment: import.meta.env.MODE === 'development',
  apiUrl,
  socketIoUrl,
};

// so far I have no logger module, so let's do the bare minimum
console.info('[moped] app configuration:', config);
