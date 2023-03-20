let apiUrl = import.meta.env.VITE_API_URL || '127.0.0.1:8080';
if (!/^https?:\/\//.test(apiUrl)) apiUrl = `http://${apiUrl}`;

export const config = {
  apiUrl,
};
