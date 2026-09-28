import { useSyncExternalStore } from 'react';

export function createStore(initial) {
  let state = initial;
  const subs = new Set();
  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      subs.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}

export const useStore = (store) => useSyncExternalStore(store.subscribe, store.get, store.get);

/** Global story state shared across scenes. */
export const story = createStore({ entered: false, still: false, overlay: false });
