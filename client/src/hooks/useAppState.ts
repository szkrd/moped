import { useEffect, useState } from 'react';
import { appState, IAppState } from '../state/appState';

export function useAppState<T>(scope: (state: IAppState) => T) {
  const [localState, setLocalState] = useState<T>(scope(appState._get()));
  useEffect(() => {
    const unsubscribe = appState.onChange((state) => {
      setLocalState(scope(state));
    });
    return () => {
      unsubscribe();
    };
  }, [setLocalState]);
  // ^ using localState would trigger an extra rerender, but since
  // we're using immer, we won't need primitive change detection anyway
  return localState;
}
