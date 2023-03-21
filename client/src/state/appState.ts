import EventEmitter from 'events';
import produce from 'immer';
import { DeepPartial } from '../utils/typescript/deepPartial';
import { getInitialApiState } from './apiState';
import { getInitialCurrentSongState } from './currentSongState';
import { getInitialStatsState } from './statsState';

const appStateEvents = new EventEmitter();
let _appState = {
  api: getInitialApiState(),
  stats: getInitialStatsState(),
  currentSong: getInitialCurrentSongState(),
};

export type IAppState = typeof _appState;

export type IPartialAppState = DeepPartial<IAppState>;

function update(action: (writableState: IAppState) => void) {
  _appState = produce(_appState, (draftState: IAppState) => {
    action(draftState);
  }) as any as IAppState;
  appStateEvents.emit('change', _appState);
}

function onChange(cb: (state: IAppState) => void) {
  appStateEvents.on('change', cb);
  return () => appStateEvents.off('change', cb);
}

export const appState = {
  update,
  onChange,
  _get: () => _appState,
};
