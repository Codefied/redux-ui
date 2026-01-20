'use strict';

/**
 * getUIState inspects redux' global state store and returns the UI state node.
 *
 * This checks to see whether state is an immutable map or a POJO.
 */
export const getUIState = (state: any): any => {
  if (typeof state?.get === 'function') {
    // Handle Immutable.js state (for backward compatibility with existing stores)
    return state.get('ui');
  }
  return state?.ui;
};
