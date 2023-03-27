/* eslint-disable react-hooks/exhaustive-deps */
import { DependencyList, useCallback } from 'react';

type TCallback = (id: number) => void;

export const useDatasetCallback = (cb: TCallback, deps: DependencyList) => {
  return useCallback((event: any) => {
    const id = parseInt(event.currentTarget.dataset.id, 10);
    // will this make any sense? without further memoization?
    return cb(id);
  }, deps); // also note how eslint will stop the dep checking exactly here, which... is "not good"
};
