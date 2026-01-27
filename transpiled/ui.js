"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ui;
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
var _invariant = _interopRequireDefault(require("invariant"));
var _actionReducer = require("./action-reducer");
var _context = require("./context");
var _utils = require("./utils");
var _pathUtils = require("./pathUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// Maximum value for random key suffix (~1 billion, gives 8 hex chars)
var MAX_RANDOM_KEY = 1 << 30;
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
function generateKey(WrappedComponent) {
  return getDisplayName(WrappedComponent) + Math.floor(Math.random() * MAX_RANDOM_KEY).toString(16);
}
function ui(keyOrOpts) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (_typeof(keyOrOpts) === 'object') {
    opts = keyOrOpts;
  } else if (typeof keyOrOpts === 'string') {
    opts = _objectSpread(_objectSpread({}, opts), {}, {
      key: keyOrOpts
    });
  }
  return function wrapWithUI(WrappedComponent) {
    function UIWrapper(props) {
      var _parentContext$uiPath;
      var parentContext = (0, _react.useContext)(_context.ReduxUIStoreContext);
      var dispatch = (0, _reactRedux.useDispatch)();
      var store = (0, _reactRedux.useStore)();

      // Read directly from store to avoid timing issues with useSelector on first render
      var getLatestUI = (0, _react.useCallback)(function () {
        return (0, _utils.getUIState)(store.getState());
      }, [store]);
      var componentKeyRef = (0, _react.useRef)(null);
      if (componentKeyRef.current === null) {
        var _opts$key;
        componentKeyRef.current = (_opts$key = opts.key) !== null && _opts$key !== void 0 ? _opts$key : generateKey(WrappedComponent);
      }
      var componentKey = componentKeyRef.current;
      var parentPath = (_parentContext$uiPath = parentContext === null || parentContext === void 0 ? void 0 : parentContext.uiPath) !== null && _parentContext$uiPath !== void 0 ? _parentContext$uiPath : [];
      var uiPath = (0, _react.useMemo)(function () {
        return [].concat(_toConsumableArray(parentPath), [componentKey]);
      }, [parentPath.join('.'), componentKey]);

      // Child's local vars override parent's vars with the same name
      var uiVars = (0, _react.useMemo)(function () {
        var _parentContext$uiVars, _opts$state;
        var parentVars = (_parentContext$uiVars = parentContext === null || parentContext === void 0 ? void 0 : parentContext.uiVars) !== null && _parentContext$uiVars !== void 0 ? _parentContext$uiVars : {};
        var localVars = {};
        var stateKeys = Object.keys((_opts$state = opts.state) !== null && _opts$state !== void 0 ? _opts$state : {});
        for (var _i = 0, _stateKeys = stateKeys; _i < _stateKeys.length; _i++) {
          var k = _stateKeys[_i];
          localVars[k] = uiPath;
        }
        return _objectSpread(_objectSpread({}, parentVars), localVars);
      }, [parentContext === null || parentContext === void 0 ? void 0 : parentContext.uiVars, uiPath]);
      var evaluateDefaults = (0, _react.useCallback)(function (stateConfig, currentProps) {
        var result = {};
        var globalState = store.getState();
        for (var _i2 = 0, _Object$entries = Object.entries(stateConfig); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          if (typeof value === 'function') {
            result[key] = value(currentProps, globalState);
          } else {
            result[key] = value;
          }
        }
        return result;
      }, [store]);
      var isInitializedRef = (0, _react.useRef)(false);
      var isMountedRef = (0, _react.useRef)(true);
      var _useState = (0, _react.useState)(0),
        _useState2 = _slicedToArray(_useState, 2),
        renderCount = _useState2[0],
        forceUpdate = _useState2[1];

      // Synchronous initialization during render
      // This is necessary because children need to see parent's state during their render
      // React will batch this dispatch with subsequent renders
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        var currentUI = getLatestUI();
        var currentState = (0, _pathUtils.getIn)(currentUI, uiPath);
        if (currentState === undefined && opts.state) {
          var defaults = evaluateDefaults(opts.state, props);
          store.dispatch((0, _actionReducer.mountUI)(uiPath, defaults, opts.reducer));
        }
      }

      // Force re-render after initial mount to pick up dispatched state
      (0, _react.useLayoutEffect)(function () {
        if (renderCount === 0) {
          forceUpdate(1);
        }
      }, [renderCount]);

      // Store uiPath in ref to capture value for cleanup closure
      // This prevents stale closure issues if uiPath were to change
      var uiPathRef = (0, _react.useRef)(uiPath);
      uiPathRef.current = uiPath;
      (0, _react.useLayoutEffect)(function () {
        return function () {
          isMountedRef.current = false;
          if (opts.persist !== true) {
            // requestAnimationFrame avoids issues with @connect selectors during unmount
            if (typeof window !== 'undefined' && window.requestAnimationFrame) {
              window.requestAnimationFrame(function () {
                dispatch((0, _actionReducer.unmountUI)(uiPathRef.current));
              });
            } else {
              dispatch((0, _actionReducer.unmountUI)(uiPathRef.current));
            }
          }
        };
        // Intentionally empty deps: cleanup runs only once on unmount.
        // We use uiPathRef.current to always get the latest path value.
        // dispatch is stable from useDispatch, opts.persist is captured at mount time.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      var globalUI = (0, _reactRedux.useSelector)(_utils.getUIState);

      // Restore defaults when parent's resetUI blows away our state
      var prevStateRef = (0, _react.useRef)(undefined);
      (0, _react.useLayoutEffect)(function () {
        var latestState = (0, _pathUtils.getIn)(getLatestUI(), uiPath);
        if (isInitializedRef.current && latestState === undefined && prevStateRef.current !== undefined && opts.state) {
          var _defaults = evaluateDefaults(opts.state, props);
          dispatch((0, _actionReducer.setDefaultUI)(uiPath, _defaults));
        }
        prevStateRef.current = latestState;
      });
      var updateUICallback = (0, _react.useCallback)(function (nameOrUpdates, value) {
        if (_typeof(nameOrUpdates) === 'object' && value === undefined) {
          dispatch((0, _actionReducer.massUpdateUI)(uiVars, nameOrUpdates));
          return;
        }
        var name = nameOrUpdates;
        var uiVarPath = uiVars[name];
        (0, _invariant["default"])(uiVarPath, "The '".concat(name, "' UI variable is not defined in the UI context in \"") + getDisplayName(WrappedComponent) + '" ' + 'or any parent UI context. Set this variable using the "state" ' + 'option in the @ui decorator before using it.');
        dispatch((0, _actionReducer.updateUI)(uiVarPath, name, value));
      }, [uiVars, dispatch]);
      var resetUI = (0, _react.useCallback)(function () {
        if (opts.state) {
          var _defaults2 = evaluateDefaults(opts.state, props);
          dispatch((0, _actionReducer.setDefaultUI)(uiPath, _defaults2));
        }
      }, [uiPath, dispatch, evaluateDefaults, props]);
      var previousMergedUI = (0, _react.useRef)({});
      var mergedUI = (0, _react.useMemo)(function () {
        var ui = getLatestUI();
        var result = {};
        for (var _i3 = 0, _Object$entries2 = Object.entries(uiVars); _i3 < _Object$entries2.length; _i3++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
            varName = _Object$entries2$_i[0],
            varPath = _Object$entries2$_i[1];
          result[varName] = (0, _pathUtils.getIn)(ui, [].concat(_toConsumableArray(varPath), [varName]));
        }
        if ((0, _reactRedux.shallowEqual)(previousMergedUI.current, result)) {
          return previousMergedUI.current;
        }
        previousMergedUI.current = result;
        return result;
        // Deps intentionally exclude previousMergedUI (ref, always current) - we only
        // want to recompute when the store changes (globalUI) or variable mappings change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [globalUI, uiVars, getLatestUI]);
      var contextValue = (0, _react.useMemo)(function () {
        return {
          uiKey: componentKey,
          uiPath: uiPath,
          uiVars: uiVars,
          updateUI: updateUICallback,
          resetUI: resetUI
        };
      }, [componentKey, uiPath, uiVars, updateUICallback, resetUI]);
      return /*#__PURE__*/_react["default"].createElement(_context.ReduxUIStoreContext.Provider, {
        value: contextValue
      }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({}, props, {
        ui: mergedUI,
        uiKey: componentKey,
        uiPath: uiPath,
        updateUI: updateUICallback,
        resetUI: resetUI
      })));
    }
    UIWrapper.displayName = "UI(".concat(getDisplayName(WrappedComponent), ")");
    return UIWrapper;
  };
}