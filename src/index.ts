'use strict';

import ui from './ui';

// Re-export everything from action-reducer for backward compatibility
export {
  default as reducer,
  // Export action creators and types for advanced usage
  updateUI,
  massUpdateUI,
  setDefaultUI,
  mountUI,
  unmountUI,
  reducerEnhancer,
  defaultState,
  UPDATE_UI_STATE,
  MASS_UPDATE_UI_STATE,
  SET_DEFAULT_UI_STATE
} from './action-reducer';

export { ReduxUIStoreContext } from './context';
export type { UIOptions, UIProps, UIState, UIContextValue } from './types';

export default ui;
