import { ConfigStatesType, InitialStateType } from './types';

export const getInitialState = (states: ConfigStatesType): InitialStateType => {
  const keys = Object.keys(states);
  const result = keys.reduce((acc, key) => {
    const next = { [key]: states[key].defaultValue };
    const merged = { ...acc, ...next };
    return merged;
  }, {});
  return result;
};