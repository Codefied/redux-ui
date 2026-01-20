// src/compat.ts
import { getIn, setIn } from './pathUtils';

// Track which deprecation warnings have been shown
const shownWarnings = new Set<string>();

function warnOnce(method: string, message: string): void {
  const key = method;
  if (!shownWarnings.has(key)) {
    shownWarnings.add(key);
    console.warn(`[redux-ui] ${method}() is deprecated. ${message}`);
  }
}

export interface CompatibleState<T extends Record<string, any>> {
  /**
   * @deprecated Use direct property access instead: `state.key`
   */
  get<K extends keyof T>(key: K): T[K];

  /**
   * @deprecated Use spread operator instead: `{ ...state, key: value }`
   */
  set<K extends keyof T>(key: K, value: T[K]): CompatibleState<T>;

  /**
   * @deprecated Use optional chaining instead: `state.foo?.bar`
   */
  getIn(path: string[]): any;

  /**
   * @deprecated Use spread operators for nested updates
   */
  setIn(path: string[], value: any): CompatibleState<T>;

  /**
   * @deprecated State is already a plain object, no conversion needed
   */
  toJS(): T;

  /**
   * @deprecated State is already a plain object, no conversion needed
   */
  toObject(): T;
}

/**
 * Wraps a plain object with Immutable.js-like methods for backward compatibility.
 * All methods log deprecation warnings on first use.
 */
export function createCompatibleState<T extends Record<string, any>>(
  plainState: T
): T & CompatibleState<T> {
  const compatMethods: CompatibleState<T> = {
    get<K extends keyof T>(key: K): T[K] {
      warnOnce('get', 'Use direct property access instead: state.key');
      return plainState[key];
    },

    set<K extends keyof T>(key: K, value: T[K]): CompatibleState<T> {
      warnOnce('set', 'Use spread operator instead: { ...state, key: value }');
      return createCompatibleState({ ...plainState, [key]: value } as T);
    },

    getIn(path: string[]): any {
      warnOnce('getIn', 'Use optional chaining instead: state.foo?.bar');
      return getIn(plainState, path);
    },

    setIn(path: string[], value: any): CompatibleState<T> {
      warnOnce('setIn', 'Use spread operators for nested updates');
      return createCompatibleState(setIn(plainState, path, value));
    },

    toJS(): T {
      warnOnce('toJS', 'State is already a plain object, no conversion needed');
      return plainState;
    },

    toObject(): T {
      warnOnce('toObject', 'State is already a plain object, no conversion needed');
      return plainState;
    }
  };

  // Return object that has both the plain state properties and compat methods
  return Object.assign({}, plainState, compatMethods);
}

/**
 * Unwrap a potentially compatible state back to a plain object.
 * Handles both CompatibleState and plain objects.
 */
export function unwrapState<T extends Record<string, any>>(
  state: T | CompatibleState<T>
): T {
  // If it has toJS, it might be CompatibleState or Immutable - unwrap it
  if (state && typeof (state as any).toJS === 'function') {
    return (state as any).toJS();
  }
  return state as T;
}

/**
 * Reset deprecation warnings (useful for testing)
 */
export function resetWarnings(): void {
  shownWarnings.clear();
}
