import { appState } from '../state/appState';
import { ICurrentSongState } from '../state/currentSongState';
import { IRequestOptions, request } from '../utils/fetch/request';

export enum ApiUrl {
  Status = '/status/status',
  Stats = '/status/stats',
  CurrentSong = '/status/current-song',
  Volume = '/playback-options/volume',
  Stop = '/controlling-playback/stop',
  Previous = '/controlling-playback/previous',
  Next = '/controlling-playback/next',
  Pause = '/controlling-playback/pause',
  Play = '/controlling-playback/play',
  Likes = '/extra/likes',
  Like = '/extra/like',
}

export const apiCall = (url: ApiUrl, options: IRequestOptions = {}) => {
  appState.update((state) => state.api.callCount++);
  return request(url, options).finally(() => {
    appState.update((state) => state.api.callCount--);
  });
};

export const apiGetStatus = () => {
  return apiCall(ApiUrl.Status).then((response) => {
    appState.update((state) => {
      state.status = response;
    });
  });
};

export const apiGetAllStats = () => {
  return Promise.all([apiCall(ApiUrl.Stats), apiCall(ApiUrl.Status), apiCall(ApiUrl.CurrentSong)]).then((responses) => {
    const [stats, status, currentSong] = responses;
    appState.update((state) => {
      state.stats = stats;
      state.status = status;
      state.currentSong = currentSong;
    });
  });
};

export const apiGetFavorites = () => {
  return apiCall(ApiUrl.Likes).then((response) => {
    appState.update((state) => (state.favorites = response));
  });
};

export const apiPostLikeCurrentSong = (currentSong: ICurrentSongState) => {
  // it's better to get the current song as param, since that's what we see on the UI realtime
  return apiCall(ApiUrl.Like, { method: 'POST', data: currentSong }).then(() => {
    return apiGetFavorites();
  });
};
