'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ui;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = require("prop-types");
var _redux = require("redux");
var _reactRedux = require("react-redux");
var _invariant = _interopRequireDefault(require("invariant"));
var _shallowEqual = _interopRequireDefault(require("react-pure-render/shallowEqual"));
var _actionReducer = require("./action-reducer");
var _ReduxUIStoreContext = require("./ReduxUIStoreContext");
var _utils = require("./utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ui(key) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (_typeof(key) === 'object') {
    opts = key;
    key = opts.key;
  }
  var connector = (0, _reactRedux.connect)(function (state) {
    return {
      ui: (0, _utils.getUIState)(state)
    };
  }, function (dispatch) {
    return (0, _redux.bindActionCreators)({
      updateUI: _actionReducer.updateUI,
      massUpdateUI: _actionReducer.massUpdateUI,
      setDefaultUI: _actionReducer.setDefaultUI,
      mountUI: _actionReducer.mountUI,
      unmountUI: _actionReducer.unmountUI
    }, dispatch);
  },
  // These allow you to pass 'mergeProps' and 'options' keys into the
  // UI decorator's options which will be passed to @connect().
  // TODO: Document
  opts.mergeProps, opts.options);
  return function (WrappedComponent) {
    // Return a parent UI class which scopes all UI state to the given key
    /**
     * UI is a wrapper component which:
     *   1. Inherits any parent scopes from parent components that are wrapped
     *      by @UI
     *   2. Sets up a new UI scope for the current component
     *   3. Merges the current UI scope into the parent UI scope (where the
     *      current scope takes precedence over parents)
     *
     * This allows normal block-scoping of UI state:
     *
     *   1. All UI components must define their local state keys
     *   2. Upon updating a state key, if it's not in the current scope
     *      walk up the tree until the variable is set
     *
     * This means that any child component can affect the current browser
     * chrome's UI state whilst maintaining their own local UI state.
     *
     * All state will be blown away on navigation by default.
     */
    var UI = /*#__PURE__*/function (_Component) {
      function UI(props, ctx, queue) {
        var _this;
        _classCallCheck(this, UI);
        _this = _callSuper(this, UI, [props, ctx, queue]);
        _this.resetUI = _this.resetUI.bind(_this);
        _this.updateUI = _this.updateUI.bind(_this);

        // If the key is undefined generate a new random hex key for the
        // current component's UI scope.
        //
        // We do this in construct() to guarantee a new key at component
        // instantiation time wihch is needed for iterating through a list of
        // components with no explicit key
        if (key === undefined) {
          _this.key = (WrappedComponent.displayName || WrappedComponent.name) + Math.floor(Math.random() * (1 << 30)).toString(16);
        } else {
          _this.key = key;
        }

        // Immediately set this.uiPath and this.uiVars based on the incoming
        // context in class instantiation
        _this.getMergedContextVars(_this.context);
        return _this;
      }
      _inherits(UI, _Component);
      return _createClass(UI, [{
        key: "UNSAFE_componentWillMount",
        value:
        // Pass these down in the new context created for this component
        // static childContextTypes = {
        //     // uiKey is the name of the parent context's key
        //     uiKey: string,
        //     // uiPath is the current path of the UI context
        //     uiPath: array,
        //     // uiVars is a map of UI variable names stored in state to the parent
        //     // context which controls them.
        //     uiVars: object,
        //
        //     // Actions to pass to children
        //     updateUI: func,
        //     resetUI: func
        // }
        //
        // // Get the existing context from a UI parent, if possible
        // static contextTypes = {
        //     // This is used in mergeUIProps and construct() to immediately set
        //     // props.
        //
        //     uiKey: string,
        //     uiPath: array,
        //     uiVars: object,
        //
        //     updateUI: func,
        //     resetUI: func
        // }

        function UNSAFE_componentWillMount() {
          // If the component's UI subtree doesn't exist and we have state to
          // set ensure we update our global store with the current state.
          if (this.props.ui.getIn(this.uiPath) === undefined && opts.state) {
            var state = this.getDefaultUIState(opts.state);
            this.context.store.dispatch((0, _actionReducer.mountUI)(this.uiPath, state, opts.reducer));
          }
        }

        // When a parent context calls resetUI it blows away the entire subtree
        // that any child contexts may store state in.
        //
        // We may need to restore default props for this component if a parent
        // has blown away our state.
      }, {
        key: "UNSAFE_componentWillReceiveProps",
        value: function UNSAFE_componentWillReceiveProps(nextProps) {
          // We can only see if this component's state is blown away by
          // accessing the current global UI state; the parent will not
          // necessarily always pass down child state.
          var ui = (0, _utils.getUIState)(this.context.store.getState());
          if (ui.getIn(this.uiPath) === undefined && opts.state) {
            var state = this.getDefaultUIState(opts.state, nextProps);
            this.props.setDefaultUI(this.uiPath, state);
          }
        }

        // Get default state by evaluating any functions passed in to the state
        // opts.
        // This is also used within componentWilLReceiveProps and so props
        // also needs to be passed in
      }, {
        key: "getDefaultUIState",
        value: function getDefaultUIState(uiState) {
          var _this2 = this;
          var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props;
          var globalState = this.context.store.getState();
          var state = _objectSpread({}, uiState);
          Object.keys(state).forEach(function (k) {
            if (typeof state[k] === 'function') {
              state[k] = state[k](_this2.props, globalState);
            }
          });
          return state;
        }

        // Blow away all UI state for this component key by setting the
        // state for this key to undefined. This will get reset to the
        // default state in componentWillMount in the future.
        //
        // We use requestAnimationFrame because `@ui()` can be combined with
        // with `@connect()`; if the connect decorator uses selectors based on
        // UI state (such as live filtering) the connect decorator will receive
        // `undefined` as `this.props.ui` before unmounting.
        //
        // requestAnimationFrame avoids this.
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var _this3 = this;
          if (opts.persist !== true) {
            if (window && window.requestAnimationFrame) {
              window.requestAnimationFrame(function () {
                return _this3.props.unmountUI(_this3.uiPath);
              });
            } else {
              this.props.unmountUI(this.uiPath);
            }
          }
        }

        // Sets this.uiVars && this.uiPath.
        //
        // Merges this UI context's variables with any parent context's
        // variables defined in uiVars.
      }, {
        key: "getMergedContextVars",
        value: function getMergedContextVars() {
          var _this4 = this;
          var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.context;
          if (!this.uiVars || !this.uiPath) {
            var uiPath = ctx.uiPath || [];
            this.uiPath = uiPath.concat(this.key);

            // Keep trackof each UI variable and which path it should be set in
            var state = opts.state || {};
            this.uiVars = _objectSpread({}, ctx.uiVars) || {};
            Object.keys(state).forEach(function (k) {
              return _this4.uiVars[k] = _this4.uiPath;
            }, this);
          }
          return [this.uiVars, this.uiPath];
        }

        // Construct a new context for all child UI components. We need to merge
        // in the vars defined in opts.state to uiVars to explicitly state that
        // this context is in charge of those variables.
        //
        // Pass the uiKey and partially applied updateUI function to all
        // child components that are wrapped in a plain `@ui()` decorator
      }, {
        key: "getContextForChild",
        value: function getContextForChild() {
          var _this$getMergedContex = this.getMergedContextVars(),
            _this$getMergedContex2 = _slicedToArray(_this$getMergedContex, 2),
            uiVars = _this$getMergedContex2[0],
            uiPath = _this$getMergedContex2[1];
          return {
            store: this.context.store,
            uiKey: this.key,
            uiVars: uiVars,
            uiPath: uiPath,
            updateUI: this.updateUI,
            resetUI: this.resetUI
          };
        }

        // Helper function to reset UI for the current context **and all child
        // scopes**.
        //
        // This is the same as exiting scope in programming; all variables
        // defined within the scope are reset.
      }, {
        key: "resetUI",
        value: function resetUI() {
          this.props.setDefaultUI(this.uiPath, this.getDefaultUIState(opts.state));
          // TODO: Wipe all child contexts
        }
      }, {
        key: "updateUI",
        value: function updateUI(name, value) {
          // Get a list of all UI variables available to this context (which
          // lists parent contexts) to see which key we need to set this in.
          var _this$getMergedContex3 = this.getMergedContextVars(),
            _this$getMergedContex4 = _slicedToArray(_this$getMergedContex3, 1),
            uiVars = _this$getMergedContex4[0];
          var uiVarPath = uiVars[name];
          if (_typeof(name) === 'object' && value === undefined) {
            // We're mass updating many UI variables. These may or may not be
            // directly controlled by our context, so we delegate to the
            // reducer which will deeply set each variable according to its
            // uiPath (from uiVars).
            //
            // Doing this means we only trigger one store update.
            this.props.massUpdateUI(this.uiVars, name);
            return;
          }
          (0, _invariant["default"])(uiVarPath, "The '".concat(name, "' UI variable is not defined in the UI context in \"") + (WrappedComponent.displayName || WrappedComponent.name) + '" ' + 'or any parent UI context. Set this variable using the "state" ' + 'option in the @ui decorator before using it.');
          this.props.updateUI(uiVarPath, name, value);
        }

        // Iterate through the list of contexts merging in UI variables from the
        // UI store
      }, {
        key: "mergeUIProps",
        value: function mergeUIProps() {
          var _this5 = this;
          // WARNING: React has a subtle componentWillMount bug which we're
          // working around here!
          //
          // ## React bug
          //
          // On the first *ever* render of this component we set defaults in
          // componentWillMount. This works; when `render()` is called the
          // wrapped component has the default props within this.props.ui
          //
          // BUT.  Unmount, navigate away then return to this component.  When
          // componentWillMount is called a *second* time, we call updateUI to
          // set default props. **These aren't passed in to render() until the
          // component is mounted a second time**. Even though it worked first
          // time. And even though this is a new instance of the component.
          //
          // ## Workaround.
          //
          // Instead of relying on this.props.ui from our connector we call
          // getState() in the store directly here. We guarantee that this will
          // be the latest set of props, including default props set in
          // componentWillMount.
          //
          // We still use @connect() to connect to the store and listen for
          // changes in other cases.
          var ui = (0, _utils.getUIState)(this.context.store.getState());
          var result = Object.keys(this.uiVars).reduce(function (props, k) {
            props[k] = ui.getIn(_this5.uiVars[k].concat(k));
            return props;
          }, {}) || {};

          // If this slice of the UI has not changed (shallow comparison),
          // then use an old copy of the slice to prevent unnecessary
          // re-rendering
          if (!(0, _shallowEqual["default"])(this.__previousMergeResult, result)) {
            this.__previousMergeResult = result;
          }
          return this.__previousMergeResult;
        }
      }, {
        key: "render",
        value: function render() {
          return /*#__PURE__*/_react["default"].createElement(_ReduxUIStoreContext.ReduxUIStoreContext.Provider, {
            value: this.getContextForChild()
          }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({}, this.props, {
            uiKey: this.key,
            uiPath: this.uiPath,
            ui: this.mergeUIProps(),
            resetUI: this.resetUI,
            updateUI: this.updateUI
          })));
        }
      }]);
    }(_react.Component);
    _defineProperty(UI, "propTypes", {
      // The entire global UI state via react-redux connector
      ui: _propTypes.object.isRequired,
      // These actions are passed via react-redux connector
      setDefaultUI: _propTypes.func.isRequired,
      updateUI: _propTypes.func.isRequired,
      massUpdateUI: _propTypes.func.isRequired
    });
    UI.contextType = _ReduxUIStoreContext.ReduxUIStoreContext;
    return connector(UI);
  };
}