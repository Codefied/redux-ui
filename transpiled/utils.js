"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUIState = void 0;
var getUIState = exports.getUIState = function getUIState(state) {
  if (typeof (state === null || state === void 0 ? void 0 : state.get) === 'function') {
    // Handle Immutable.js state (for backward compatibility with existing stores)
    return state.get('ui');
  }
  return state === null || state === void 0 ? void 0 : state.ui;
};