"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MASS_UPDATE_UI_STATE", {
  enumerable: true,
  get: function get() {
    return _actionReducer.MASS_UPDATE_UI_STATE;
  }
});
Object.defineProperty(exports, "ReduxUIStoreContext", {
  enumerable: true,
  get: function get() {
    return _context.ReduxUIStoreContext;
  }
});
Object.defineProperty(exports, "SET_DEFAULT_UI_STATE", {
  enumerable: true,
  get: function get() {
    return _actionReducer.SET_DEFAULT_UI_STATE;
  }
});
Object.defineProperty(exports, "UPDATE_UI_STATE", {
  enumerable: true,
  get: function get() {
    return _actionReducer.UPDATE_UI_STATE;
  }
});
exports["default"] = void 0;
Object.defineProperty(exports, "defaultState", {
  enumerable: true,
  get: function get() {
    return _actionReducer.defaultState;
  }
});
Object.defineProperty(exports, "massUpdateUI", {
  enumerable: true,
  get: function get() {
    return _actionReducer.massUpdateUI;
  }
});
Object.defineProperty(exports, "mountUI", {
  enumerable: true,
  get: function get() {
    return _actionReducer.mountUI;
  }
});
Object.defineProperty(exports, "reducer", {
  enumerable: true,
  get: function get() {
    return _actionReducer["default"];
  }
});
Object.defineProperty(exports, "reducerEnhancer", {
  enumerable: true,
  get: function get() {
    return _actionReducer.reducerEnhancer;
  }
});
Object.defineProperty(exports, "setDefaultUI", {
  enumerable: true,
  get: function get() {
    return _actionReducer.setDefaultUI;
  }
});
Object.defineProperty(exports, "unmountUI", {
  enumerable: true,
  get: function get() {
    return _actionReducer.unmountUI;
  }
});
Object.defineProperty(exports, "updateUI", {
  enumerable: true,
  get: function get() {
    return _actionReducer.updateUI;
  }
});
var _ui = _interopRequireDefault(require("./ui"));
var _actionReducer = _interopRequireWildcard(require("./action-reducer"));
var _context = require("./context");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Re-export everything from action-reducer for backward compatibility
var _default = exports["default"] = _ui["default"];