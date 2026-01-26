'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_UI_STATE = exports.SET_DEFAULT_UI_STATE = exports.MASS_UPDATE_UI_STATE = void 0;
exports["default"] = reducer;
exports.defaultState = void 0;
exports.massUpdateUI = massUpdateUI;
exports.mountUI = mountUI;
exports.reducerEnhancer = void 0;
exports.setDefaultUI = setDefaultUI;
exports.unmountUI = unmountUI;
exports.updateUI = updateUI;
var _invariant = _interopRequireDefault(require("invariant"));
var _pathUtils = require("./pathUtils");
var _compat = require("./compat");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Action types
var MASS_UPDATE_UI_STATE = exports.MASS_UPDATE_UI_STATE = '@@redux-ui/MASS_UPDATE_UI_STATE';
var UPDATE_UI_STATE = exports.UPDATE_UI_STATE = '@@redux-ui/UPDATE_UI_STATE';
var SET_DEFAULT_UI_STATE = exports.SET_DEFAULT_UI_STATE = '@@redux-ui/SET_DEFAULT_UI_STATE';

// Private action types
var MOUNT_UI_STATE = '@@redux-ui/MOUNT_UI_STATE';
var UNMOUNT_UI_STATE = '@@redux-ui/UNMOUNT_UI_STATE';
var defaultState = exports.defaultState = {
  __reducers: {}
};
function reducer() {
  var _action$payload$key, _action$payload;
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var key = (_action$payload$key = (_action$payload = action.payload) === null || _action$payload === void 0 ? void 0 : _action$payload.key) !== null && _action$payload$key !== void 0 ? _action$payload$key : [];
  if (!Array.isArray(key)) {
    key = [key];
  }
  switch (action.type) {
    case UPDATE_UI_STATE:
      {
        var _action$payload2 = action.payload,
          name = _action$payload2.name,
          value = _action$payload2.value;
        var path = [].concat(_toConsumableArray(key), [name]);
        if (typeof value === 'function') {
          var current = (0, _pathUtils.getIn)(state, path);
          state = (0, _pathUtils.setIn)(state, path, value(current));
        } else {
          state = (0, _pathUtils.setIn)(state, path, value);
        }
        break;
      }
    case MASS_UPDATE_UI_STATE:
      {
        var _action$payload3 = action.payload,
          uiVars = _action$payload3.uiVars,
          transforms = _action$payload3.transforms;
        for (var _i = 0, _Object$keys = Object.keys(transforms); _i < _Object$keys.length; _i++) {
          var k = _Object$keys[_i];
          var varPath = uiVars[k];
          (0, _invariant["default"])(varPath, "Couldn't find variable ".concat(k, " within your component's UI state ") + "context. Define ".concat(k, " before using it in the @ui decorator"));
          state = (0, _pathUtils.setIn)(state, [].concat(_toConsumableArray(varPath), [k]), transforms[k]);
        }
        break;
      }
    case SET_DEFAULT_UI_STATE:
      {
        state = (0, _pathUtils.setIn)(state, key, action.payload.value);
        break;
      }
    case MOUNT_UI_STATE:
      {
        var _action$payload4 = action.payload,
          defaults = _action$payload4.defaults,
          customReducer = _action$payload4.customReducer;
        state = (0, _pathUtils.setIn)(state, key, _objectSpread({}, defaults));
        if (customReducer) {
          var reducerKey = key.join('.');
          state = (0, _pathUtils.setIn)(state, ['__reducers', reducerKey], {
            path: key,
            func: customReducer
          });
        }
        break;
      }
    case UNMOUNT_UI_STATE:
      {
        state = (0, _pathUtils.deleteIn)(state, key);
        var _reducerKey = key.join('.');
        state = (0, _pathUtils.deleteIn)(state, ['__reducers', _reducerKey]);
        break;
      }
  }

  // Run custom reducers
  var customReducers = state.__reducers;
  if (customReducers && Object.keys(customReducers).length > 0) {
    for (var _i2 = 0, _Object$keys2 = Object.keys(customReducers); _i2 < _Object$keys2.length; _i2++) {
      var _reducerKey2 = _Object$keys2[_i2];
      var r = customReducers[_reducerKey2];
      if (!r) continue;
      var _path = r.path,
        func = r.func;
      var componentState = (0, _pathUtils.getIn)(state, _path);

      // Wrap state with compatibility shim for custom reducers
      var compatibleState = (0, _compat.createCompatibleState)(componentState !== null && componentState !== void 0 ? componentState : {});
      var newState = func(compatibleState, action);
      if (newState !== undefined) {
        // Unwrap the result in case they returned a CompatibleState
        var unwrapped = (0, _compat.unwrapState)(newState);
        state = (0, _pathUtils.setIn)(state, _path, unwrapped);
      }
    }
  }
  return state;
}
var reducerEnhancer = exports.reducerEnhancer = function reducerEnhancer(customReducer) {
  return function (state, action) {
    state = reducer(state, action);
    if (typeof customReducer === 'function') {
      // Wrap entire state with compatibility shim
      var compatibleState = (0, _compat.createCompatibleState)(state);
      var result = customReducer(compatibleState, action);
      state = (0, _compat.unwrapState)(result);
    }
    return state;
  };
};
function updateUI(key, name, value) {
  return {
    type: UPDATE_UI_STATE,
    payload: {
      key: key,
      name: name,
      value: value
    }
  };
}
function massUpdateUI(uiVars, transforms) {
  return {
    type: MASS_UPDATE_UI_STATE,
    payload: {
      uiVars: uiVars,
      transforms: transforms
    }
  };
}
function setDefaultUI(key, value) {
  return {
    type: SET_DEFAULT_UI_STATE,
    payload: {
      key: key,
      value: value
    }
  };
}
function unmountUI(key) {
  return {
    type: UNMOUNT_UI_STATE,
    payload: {
      key: key
    }
  };
}
function mountUI(key, defaults, customReducer) {
  return {
    type: MOUNT_UI_STATE,
    payload: {
      key: key,
      defaults: defaults,
      customReducer: customReducer
    }
  };
}