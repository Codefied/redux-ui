'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ReduxUIStoreContext", {
  enumerable: true,
  get: function get() {
    return _ReduxUIStoreContext.ReduxUIStoreContext;
  }
});
exports["default"] = void 0;
Object.defineProperty(exports, "reducer", {
  enumerable: true,
  get: function get() {
    return _actionReducer["default"];
  }
});
var _ui = _interopRequireDefault(require("./ui"));
var _actionReducer = _interopRequireDefault(require("./action-reducer"));
var _ReduxUIStoreContext = require("./ReduxUIStoreContext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var _default = exports["default"] = _ui["default"];