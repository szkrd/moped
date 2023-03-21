import { appState } from '../state/appState';
import { IRequestOptions, request } from '../utils/fetch/request';

export const apiCall = (url: string, options: IRequestOptions = {}) => {
  appState.update((state) => state.api.callCount++);
  return request(url, options).finally(() => {
    appState.update((state) => state.api.callCount--);
  });
};
