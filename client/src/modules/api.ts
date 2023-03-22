import { appState } from '../state/appState';
import { ICurrentSongState } from '../state/currentSongState';
import { IRequestOptions, request } from '../utils/fetch/request';

export const apiCall = (url: string, options: IRequestOptions = {}) => {
  appState.update((state) => state.api.callCount++);
  return request(url, options).finally(() => {
    appState.update((state) => state.api.callCount--);
  });
};

export const apiGetStatus = () => {
  return apiCall('/status/status').then((response) => {
    appState.update((state) => {
      state.status = response;
    });
  });
};

export const apiGetAllStats = () => {
  return Promise.all([apiCall('/status/stats'), apiCall('/status/status'), apiCall('/status/current-song')]).then(
    (responses) => {
      const [stats, status, currentSong] = responses;
      appState.update((state) => {
        state.stats = stats;
        state.status = status;
        state.currentSong = currentSong;
      });
    }
  );
};

export const apiGetFavorites = () => {
  return apiCall('/extra/likes').then((response) => {
    appState.update((state) => (state.favorites = response));
  });
};

export const apiPostLikeCurrentSong = (currentSong: ICurrentSongState) => {
  // it's better to get the current song as param, since that's what we see on the UI realtime
  return apiCall('/extra/like', { method: 'POST', data: currentSong }).then(() => {
    return apiGetFavorites();
  });
};
