export const getUIState = (state: any): any => {
  if (typeof state?.get === 'function') {
    // Handle Immutable.js state (for backward compatibility with existing stores)
    return state.get('ui');
  }
  return state?.ui;
};
