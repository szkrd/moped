/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { appState, IAppState } from '../state/appState';

/**
 * Detect state changes and use a scope function to return
 * a section of the store relevant for your component.
 *
 * Either return a section OR a primitive value, do NOT
 * return a new, custom object, because that will defeat
 * the purpose of immer and change detection!
 */
export function useAppState<T>(scope: (state: IAppState) => T) {
  const [localState, setLocalState] = useState<T>(scope(appState._get()));
  useEffect(() => {
    const unsubscribe = appState.onChange((state) => {
      setLocalState(scope(state));
    });
    return () => {
      unsubscribe();
    };
    // scope will always be an ad hoc dynamic function, but it _really_ should always be the same
  }, [setLocalState]);
  // ^ using localState would trigger an extra rerender, but since
  // we're using immer, we won't need primitive change detection anyway
  return localState;
}
