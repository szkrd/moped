import { ApiUrl } from '../modules/api';
import { HTTPMethod } from '../utils/fetch/request';

export interface IFromApi {
  uninitialized?: boolean;
}

export interface IOngoingCall {
  method: HTTPMethod;
  url: ApiUrl;
}

export interface IApiState {
  callCount: number;
  calls: IOngoingCall[];
}

export const getInitialApiState = (): IApiState => ({
  callCount: 0,
  calls: [],
});
