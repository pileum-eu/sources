import { ConfigStatesType, PersistListType } from './types';

export const getPersistLists = (states: ConfigStatesType): PersistListType => {
  const keys = Object.keys(states);
  const lists = keys.reduce(
    (acc: PersistListType, key: string) => {
      const state = states[key];
      const next = state.blacklist
        ? { blacklist: [...acc.blacklist, key] }
        : { whitelist: [...acc.whitelist, key] };
      const merged = { ...acc, ...next };
      return merged;
    },
    { blacklist: [], whitelist: [] },
  );
  return lists;
};
