"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCompatibleState = createCompatibleState;
exports.resetWarnings = resetWarnings;
exports.unwrapState = unwrapState;
var _pathUtils = require("./pathUtils");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var shownWarnings = new Set();
function warnOnce(method, message) {
  var key = method;
  if (!shownWarnings.has(key)) {
    shownWarnings.add(key);
    console.warn("[redux-ui] ".concat(method, "() is deprecated. ").concat(message));
  }
}
/**
 * Wraps a plain object with Immutable.js-like methods for backward compatibility.
 * All methods log deprecation warnings on first use.
 */
function createCompatibleState(plainState) {
  var compatMethods = {
    get: function get(key) {
      warnOnce('get', 'Use direct property access instead: state.key');
      return plainState[key];
    },
    set: function set(key, value) {
      warnOnce('set', 'Use spread operator instead: { ...state, key: value }');
      return createCompatibleState(_objectSpread(_objectSpread({}, plainState), {}, _defineProperty({}, key, value)));
    },
    getIn: function getIn(path) {
      warnOnce('getIn', 'Use optional chaining instead: state.foo?.bar');
      return (0, _pathUtils.getIn)(plainState, path);
    },
    setIn: function setIn(path, value) {
      warnOnce('setIn', 'Use spread operators for nested updates');
      return createCompatibleState((0, _pathUtils.setIn)(plainState, path, value));
    },
    toJS: function toJS() {
      warnOnce('toJS', 'State is already a plain object, no conversion needed');
      return plainState;
    },
    toObject: function toObject() {
      warnOnce('toObject', 'State is already a plain object, no conversion needed');
      return plainState;
    }
  };
  return Object.assign({}, plainState, compatMethods);
}
function unwrapState(state) {
  // If it has toJS, it might be CompatibleState or Immutable - unwrap it
  if (state && typeof state.toJS === 'function') {
    return state.toJS();
  }
  return state;
}
function resetWarnings() {
  shownWarnings.clear();
}