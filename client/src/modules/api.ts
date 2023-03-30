import { pull } from 'lodash';
import { IOngoingCall } from '../state/apiState';
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

export const apiCallInProgress = (calls: IOngoingCall[], url: ApiUrl, method = HTTPMethod.Get) => {
  return calls.findIndex((call) => call.method === method && call.url === url) > -1;
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
    appState.update((state) => {
      state.favorites = response;
      state.currentSong.liked =
        response.songs.findIndex(
          (song: IPartialStoredSong) => song.formattedName && song.formattedName === state.currentSong.formattedName
        ) > -1;
    });
  });
};

export const apiGetHistory = () => {
  return apiCall(ApiUrl.History).then((response) => {
    appState.update((state) => (state.history = response));
  });
};

// All actions are optimistic, if there was something wrong then the call
// triggered by the idle channel will revert/fix the state.
export const apiGetActionPlay = () => {
  return apiCall(ApiUrl.Play).then(() => {
    appState.update((state) => (state.status.state = 'play'));
  });
};

export const apiGetActionStop = () => {
  return apiCall(ApiUrl.Stop).then(() => {
    appState.update((state) => (state.status.state = 'stop'));
  });
};

export const apiGetActionPause = () => {
  return apiCall(ApiUrl.Pause).then(() => {
    appState.update((state) => (state.status.state = 'pause'));
  });
};

export const apiPostLikeSong = (currentSong: ICurrentSongState | IPartialStoredSong, updateOnly = false) => {
  // it's better to get the current song as param, since that's what we see on the UI realtime
  return apiCall(ApiUrl.Like, { method: updateOnly ? 'PATCH' : 'POST', data: currentSong }).then(() => {
    return apiGetFavorites();
  });
};

export const apiDeleteLikedSong = (id: number) => {
  return apiCall(ApiUrl.Like, { method: 'DELETE', data: { id } }).then(() => {
    return apiGetFavorites();
  });
};
