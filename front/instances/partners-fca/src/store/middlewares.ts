/* istanbul ignore file */

// declarative file
import { serviceProvidersSideEffects } from '@fc/partners';
import { initSideEffectsMiddleware, SideEffectMap } from '@fc/state-management';

const sideEffectsMap: SideEffectMap = {
  ...serviceProvidersSideEffects,
};

export const sideEffectsMiddleware = initSideEffectsMiddleware(sideEffectsMap);
