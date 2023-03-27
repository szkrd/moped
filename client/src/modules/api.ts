import { pull } from 'lodash';
import { appState } from '../state/appState';
import { ICurrentSongState } from '../state/currentSongState';
import { IPartialStoredSong } from '../state/favoritesState';
import { HTTPMethod, IRequestOptions, request } from '../utils/fetch/request';

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
  History = '/extra/history',
}

export const apiCall = (url: ApiUrl, options: IRequestOptions = {}) => {
  const method = (options.method as HTTPMethod) ?? HTTPMethod.Get;
  appState.update((state) =>
    state.api.calls.push({
      method,
      url,
    })
  );
  return request(url, options).finally(() => {
    appState.update((state) => {
      const matchingCall = state.api.calls.find((call) => call.method === method && call.url === url);
      if (matchingCall) pull(state.api.calls, matchingCall);
    });
  });
};

export const apiGetStatus = () => {
  return apiCall(ApiUrl.Status).then((response) => {
    appState.update((state) => {
      state.status = response;
    });
  });
};

export const apiGetStats = () => {
  return apiCall(ApiUrl.Stats).then((stats) => {
    appState.update((state) => {
      state.stats = stats;
    });
  });
};

export const apiGetCurrentSong = () => {
  return apiCall(ApiUrl.CurrentSong).then((currentSong) => {
    appState.update((state) => {
      state.currentSong = currentSong;
      document.title = currentSong.formattedName ?? 'moped';
    });
  });
};

export const apiGetAllStats = () => {
  return Promise.all([apiGetCurrentSong(), apiGetStatus(), apiGetStats()]);
};

export const apiGetFavorites = () => {
  return apiCall(ApiUrl.Likes).then((response) => {
    appState.update((state) => (state.favorites = response));
  });
};

export const apiGetHistory = () => {
  return apiCall(ApiUrl.History).then((response) => {
    appState.update((state) => (state.history = response));
  });
};

export const apiPostLikeSong = (currentSong: ICurrentSongState | IPartialStoredSong) => {
  // it's better to get the current song as param, since that's what we see on the UI realtime
  return apiCall(ApiUrl.Like, { method: 'POST', data: currentSong }).then(() => {
    return apiGetFavorites();
  });
};

export const apiDeleteLikedSong = (id: number) => {
  return apiCall(ApiUrl.Like, { method: 'DELETE', data: { id } }).then(() => {
    return apiGetFavorites();
  });
};
