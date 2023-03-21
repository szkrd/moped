import EventEmitter from 'events';
import produce from 'immer';
import { DeepPartial } from '../utils/typescript/deepPartial';
import { getInitialApiState } from './apiState';
import { getInitialCurrentSongState } from './currentSongState';
import { getInitialFavoritesState } from './favoritesState';
import { getInitialIdleSubsystemState } from './idleSubsystemState';
import { getInitialStatsState } from './statsState';
import { getInitialStatusState } from './statusState';

const appStateEvents = new EventEmitter();
let _appState = {
  api: getInitialApiState(),
  stats: getInitialStatsState(),
  status: getInitialStatusState(),
  currentSong: getInitialCurrentSongState(),
  favorites: getInitialFavoritesState(),
  idleSubsystem: getInitialIdleSubsystemState(),
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
