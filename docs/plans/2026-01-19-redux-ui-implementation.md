# Redux-UI Modernization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite redux-ui internals using React 17+ hooks and plain objects while maintaining full backward API compatibility.

**Architecture:** Functional HOC using hooks internally (`useContext`, `useSelector`, `useDispatch`, `useMemo`, `useCallback`, `useEffect`). Plain objects with helper utilities replace Immutable.js. Compatibility shim wraps state for custom reducers.

**Tech Stack:** TypeScript, React 17+, Redux, react-redux 7.x

---

## Pre-Implementation Setup

### Task 0: Verify existing tests pass

**Step 1: Run existing tests**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm test`

Expected: All tests pass (baseline before changes)

**Step 2: Note any existing failures**

Document any pre-existing test failures so we don't chase issues unrelated to our changes.

---

## Phase 1: TypeScript Setup

### Task 1: Add TypeScript configuration

**Files:**
- Create: `src/types.ts`
- Create: `tsconfig.json`
- Modify: `package.json`

**Step 1: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ESNext",
    "lib": ["ES2018", "DOM"],
    "jsx": "react",
    "declaration": true,
    "declarationDir": "./types",
    "outDir": "./transpiled",
    "rootDir": "./src",
    "strict": false,
    "strictNullChecks": true,
    "noImplicitAny": false,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowJs": true,
    "checkJs": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "transpiled", "test"]
}
```

**Step 2: Create src/types.ts**

```typescript
// src/types.ts
import { ComponentType } from 'react';

export interface UIState {
  __reducers: Record<string, ReducerEntry>;
  [key: string]: any;
}

export interface ReducerEntry {
  path: string[];
  func: CustomReducer;
}

export type CustomReducer = (state: any, action: any) => any;

export interface UIOptions<S extends Record<string, any> = Record<string, any>> {
  key?: string;
  state?: S | Record<string, ((props: any, state: any) => any) | any>;
  persist?: boolean;
  reducer?: CustomReducer;
  mergeProps?: any;
  options?: any;
}

export interface UIProps<S extends Record<string, any> = Record<string, any>> {
  ui: S;
  uiKey: string;
  uiPath: string[];
  updateUI: UpdateUIFunction;
  resetUI: () => void;
}

export type UpdateUIFunction = {
  (name: string, value: any): void;
  (updates: Record<string, any>): void;
};

export interface UIContextValue {
  store?: any;
  uiKey?: string;
  uiPath?: string[];
  uiVars?: Record<string, string[]>;
  updateUI?: UpdateUIFunction;
  resetUI?: () => void;
}
```

**Step 3: Install TypeScript dev dependencies**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm install --save-dev typescript @types/react @types/react-dom`

**Step 4: Commit**

```bash
git add tsconfig.json src/types.ts package.json package-lock.json
git commit -m "chore: add TypeScript configuration and types"
```

---

## Phase 2: Utility Functions

### Task 2: Create path utility functions

**Files:**
- Create: `src/pathUtils.ts`

**Step 1: Create src/pathUtils.ts with getIn, setIn, deleteIn**

```typescript
// src/pathUtils.ts

/**
 * Get a deeply nested value from an object by path.
 * Similar to Immutable.js getIn().
 */
export function getIn(obj: any, path: string[]): any {
  if (!path || path.length === 0) {
    return obj;
  }

  let current = obj;
  for (const key of path) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

/**
 * Set a deeply nested value in an object by path, returning a new object.
 * Similar to Immutable.js setIn().
 */
export function setIn<T>(obj: T, path: string[], value: any): T {
  if (!path || path.length === 0) {
    return value;
  }

  const [head, ...tail] = path;
  const currentValue = (obj as any)?.[head];

  if (tail.length === 0) {
    // Base case: set the value at this key
    return {
      ...obj,
      [head]: value
    } as T;
  }

  // Recursive case: continue down the path
  return {
    ...obj,
    [head]: setIn(currentValue ?? {}, tail, value)
  } as T;
}

/**
 * Delete a deeply nested value from an object by path, returning a new object.
 * Similar to Immutable.js deleteIn().
 */
export function deleteIn<T>(obj: T, path: string[]): T {
  if (!path || path.length === 0 || obj === null || obj === undefined) {
    return obj;
  }

  const [head, ...tail] = path;

  if (tail.length === 0) {
    // Base case: delete the key at this level
    const { [head]: _, ...rest } = obj as any;
    return rest as T;
  }

  // Recursive case: continue down the path
  const currentValue = (obj as any)?.[head];
  if (currentValue === undefined) {
    return obj;
  }

  return {
    ...obj,
    [head]: deleteIn(currentValue, tail)
  } as T;
}
```

**Step 2: Run existing tests to verify no regressions**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm test`

Expected: Tests still pass (new file not used yet)

**Step 3: Commit**

```bash
git add src/pathUtils.ts
git commit -m "feat: add path utility functions (getIn, setIn, deleteIn)"
```

---

## Phase 3: Compatibility Shim

### Task 3: Create Immutable.js compatibility shim

**Files:**
- Create: `src/compat.ts`

**Step 1: Create src/compat.ts**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/compat.ts
git commit -m "feat: add Immutable.js compatibility shim with deprecation warnings"
```

---

## Phase 4: Reducer Rewrite

### Task 4: Rewrite reducer with plain objects

**Files:**
- Modify: `src/action-reducer.js` → rename to `src/action-reducer.ts`

**Step 1: Create the new reducer file**

Create `src/action-reducer.ts` (we'll keep the old .js file temporarily for reference):

```typescript
// src/action-reducer.ts
'use strict';

import invariant from 'invariant';
import { getIn, setIn, deleteIn } from './pathUtils';
import { createCompatibleState, unwrapState } from './compat';
import type { UIState, CustomReducer } from './types';

// Action types
export const MASS_UPDATE_UI_STATE = '@@redux-ui/MASS_UPDATE_UI_STATE';
export const UPDATE_UI_STATE = '@@redux-ui/UPDATE_UI_STATE';
export const SET_DEFAULT_UI_STATE = '@@redux-ui/SET_DEFAULT_UI_STATE';

// Private action types
const MOUNT_UI_STATE = '@@redux-ui/MOUNT_UI_STATE';
const UNMOUNT_UI_STATE = '@@redux-ui/UNMOUNT_UI_STATE';

export const defaultState: UIState = {
  __reducers: {}
};

export default function reducer(state: UIState = defaultState, action: any): UIState {
  let key: string[] = action.payload?.key ?? [];

  if (!Array.isArray(key)) {
    key = [key];
  }

  switch (action.type) {
    case UPDATE_UI_STATE: {
      const { name, value } = action.payload;
      const path = [...key, name];

      if (typeof value === 'function') {
        const current = getIn(state, path);
        state = setIn(state, path, value(current));
      } else {
        state = setIn(state, path, value);
      }
      break;
    }

    case MASS_UPDATE_UI_STATE: {
      const { uiVars, transforms } = action.payload;

      for (const k of Object.keys(transforms)) {
        const varPath = uiVars[k];
        invariant(
          varPath,
          `Couldn't find variable ${k} within your component's UI state ` +
          `context. Define ${k} before using it in the @ui decorator`
        );
        state = setIn(state, [...varPath, k], transforms[k]);
      }
      break;
    }

    case SET_DEFAULT_UI_STATE: {
      state = setIn(state, key, action.payload.value);
      break;
    }

    case MOUNT_UI_STATE: {
      const { defaults, customReducer } = action.payload;
      state = setIn(state, key, { ...defaults });

      if (customReducer) {
        const reducerKey = key.join('.');
        state = setIn(state, ['__reducers', reducerKey], {
          path: key,
          func: customReducer
        });
      }
      break;
    }

    case UNMOUNT_UI_STATE: {
      state = deleteIn(state, key);
      const reducerKey = key.join('.');
      state = deleteIn(state, ['__reducers', reducerKey]);
      break;
    }
  }

  // Run custom reducers
  const customReducers = state.__reducers;
  if (customReducers && Object.keys(customReducers).length > 0) {
    for (const reducerKey of Object.keys(customReducers)) {
      const r = customReducers[reducerKey];
      if (!r) continue;

      const { path, func } = r;
      const componentState = getIn(state, path);

      // Wrap state with compatibility shim for custom reducers
      const compatibleState = createCompatibleState(componentState ?? {});
      const newState = func(compatibleState, action);

      if (newState !== undefined) {
        // Unwrap the result in case they returned a CompatibleState
        const unwrapped = unwrapState(newState);
        state = setIn(state, path, unwrapped);
      }
    }
  }

  return state;
}

export const reducerEnhancer = (customReducer: CustomReducer) =>
  (state: UIState, action: any): UIState => {
    state = reducer(state, action);
    if (typeof customReducer === 'function') {
      // Wrap entire state with compatibility shim
      const compatibleState = createCompatibleState(state);
      const result = customReducer(compatibleState, action);
      state = unwrapState(result);
    }
    return state;
  };

export function updateUI(key: string[], name: string, value: any) {
  return {
    type: UPDATE_UI_STATE,
    payload: {
      key,
      name,
      value
    }
  };
}

export function massUpdateUI(uiVars: Record<string, string[]>, transforms: Record<string, any>) {
  return {
    type: MASS_UPDATE_UI_STATE,
    payload: {
      uiVars,
      transforms
    }
  };
}

export function setDefaultUI(key: string[], value: Record<string, any>) {
  return {
    type: SET_DEFAULT_UI_STATE,
    payload: {
      key,
      value
    }
  };
}

export function unmountUI(key: string[]) {
  return {
    type: UNMOUNT_UI_STATE,
    payload: {
      key
    }
  };
}

export function mountUI(key: string[], defaults: Record<string, any>, customReducer?: CustomReducer) {
  return {
    type: MOUNT_UI_STATE,
    payload: {
      key,
      defaults,
      customReducer
    }
  };
}
```

**Step 2: Delete old action-reducer.js**

Run: `rm /Users/zoamel/Workspace/redux-ui/src/action-reducer.js`

**Step 3: Update test assertions for plain objects**

Modify `test/action-reducer/reducer.js`:

```javascript
'use strict';

import {
  reducer,
  reducerEnhancer,
  UPDATE_UI_STATE
} from '../../src/action-reducer';

import { assert } from 'chai';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { defaultState } from '../../src/action-reducer';

// Helper to deep compare plain objects
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const customReducer = (state, action) => {
  if (action.type === 'CUSTOM_ACTION_TYPE') {
    // Use compatibility shim method (deprecated but supported)
    return state.set('isHooked', true);
  }
  return state;
}
const enhancedReducer = reducerEnhancer(customReducer);

describe('reducerEnhancer', () => {
  let enhancedStore;

  beforeEach( () => {
    enhancedStore = createStore(combineReducers({ ui: enhancedReducer }));
  });

  it('delegates to the default reducer', () => {
    assert(deepEqual(enhancedStore.getState().ui, defaultState));

    enhancedStore.dispatch({
      type: UPDATE_UI_STATE,
      payload: {
        key: 'a',
        name: 'foo',
        value: 'bar'
      }
    });

    const expected = {
      __reducers: {},
      a: { foo: 'bar' }
    };
    assert(deepEqual(enhancedStore.getState().ui, expected));
  });

  it('intercepts custom actions', () => {
    assert(deepEqual(enhancedStore.getState().ui, defaultState));

    enhancedStore.dispatch({
      type: 'CUSTOM_ACTION_TYPE',
      payload: {
        foo: 'bar'
      }
    });

    const expected = {
      __reducers: {},
      isHooked: true
    };
    assert(deepEqual(enhancedStore.getState().ui, expected));
  });

  it('update ui state by updater', () => {
    assert(deepEqual(enhancedStore.getState().ui, defaultState));

    enhancedStore.dispatch({
      type: UPDATE_UI_STATE,
      payload: {
        key: 'foo',
        name: 'bar',
        value: 'baz'
      }
    });

    enhancedStore.dispatch({
      type: UPDATE_UI_STATE,
      payload: {
        key: 'foo',
        name: 'bar',
        value: baz => baz.toUpperCase()
      }
    });

    const expected = {
      __reducers: {},
      foo: { bar: 'BAZ' }
    };
    assert(deepEqual(enhancedStore.getState().ui, expected));
  });
});
```

**Step 4: Update defaults test for plain objects**

Modify `test/ui/defaults.js` line 37:

Change:
```javascript
assert.equal(typeof calcState.ui, typeof Map());
```

To:
```javascript
assert.equal(typeof calcState.ui, 'object');
```

**Step 5: Run tests**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm test`

Expected: All tests pass

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: rewrite reducer with plain objects and compatibility shim"
```

---

## Phase 5: Utils Update

### Task 5: Update utils.ts for plain objects

**Files:**
- Modify: `src/utils.js` → rename to `src/utils.ts`

**Step 1: Create src/utils.ts**

```typescript
// src/utils.ts
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
```

**Step 2: Delete old utils.js**

Run: `rm /Users/zoamel/Workspace/redux-ui/src/utils.js`

**Step 3: Run tests**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm test`

Expected: All tests pass

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: convert utils to TypeScript"
```

---

## Phase 6: Context Update

### Task 6: Update context file

**Files:**
- Modify: `src/ReduxUIStoreContext.js` → rename to `src/context.ts`

**Step 1: Create src/context.ts**

```typescript
// src/context.ts
import React from 'react';
import type { UIContextValue } from './types';

export const ReduxUIStoreContext = React.createContext<UIContextValue | null>(null);

// Re-export with old name for backward compatibility
export { ReduxUIStoreContext as default };
```

**Step 2: Delete old context file**

Run: `rm /Users/zoamel/Workspace/redux-ui/src/ReduxUIStoreContext.js`

**Step 3: Update imports in other files**

Any file importing `ReduxUIStoreContext` needs to be updated. This will be handled in the HOC rewrite.

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: convert context to TypeScript"
```

---

## Phase 7: HOC Rewrite

### Task 7: Rewrite UI HOC with hooks

**Files:**
- Modify: `src/ui.js` → rename to `src/ui.tsx`

**Step 1: Create src/ui.tsx**

```tsx
// src/ui.tsx
'use strict';

import React, {
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  ComponentType
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import invariant from 'invariant';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

import { updateUI, massUpdateUI, setDefaultUI, mountUI, unmountUI } from './action-reducer';
import { ReduxUIStoreContext } from './context';
import { getUIState } from './utils';
import { getIn } from './pathUtils';
import type { UIOptions, UIProps, UIContextValue, UpdateUIFunction } from './types';

function getDisplayName(WrappedComponent: ComponentType<any>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function generateKey(WrappedComponent: ComponentType<any>): string {
  return (
    getDisplayName(WrappedComponent) +
    Math.floor(Math.random() * (1 << 30)).toString(16)
  );
}

export default function ui<S extends Record<string, any> = Record<string, any>>(
  keyOrOpts?: string | UIOptions<S>,
  opts: UIOptions<S> = {}
) {
  // Normalize arguments (support both ui('key') and ui({ key, state }))
  if (typeof keyOrOpts === 'object') {
    opts = keyOrOpts;
  } else if (typeof keyOrOpts === 'string') {
    opts = { ...opts, key: keyOrOpts };
  }

  return function wrapWithUI<P extends object>(
    WrappedComponent: ComponentType<P & UIProps<S>>
  ): ComponentType<P> {
    function UIWrapper(props: P) {
      const parentContext = useContext(ReduxUIStoreContext);
      const dispatch = useDispatch();
      const globalUI = useSelector(getUIState);

      // Track if component is mounted (for async operations)
      const isMounted = useRef(true);

      // Generate stable key (once per component instance)
      const componentKey = useMemo(() => {
        return opts.key ?? generateKey(WrappedComponent);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      // Calculate paths based on parent context
      const uiPath = useMemo(() => {
        const parentPath = parentContext?.uiPath ?? [];
        return [...parentPath, componentKey];
      }, [parentContext?.uiPath, componentKey]);

      // Build uiVars map (which context owns which variables)
      const uiVars = useMemo(() => {
        const parentVars = parentContext?.uiVars ?? {};
        const localVars: Record<string, string[]> = {};
        const stateKeys = Object.keys(opts.state ?? {});
        for (const k of stateKeys) {
          localVars[k] = uiPath;
        }
        return { ...parentVars, ...localVars };
      }, [parentContext?.uiVars, uiPath]);

      // Evaluate default state (handles function values)
      const evaluateDefaults = useCallback((
        stateConfig: Record<string, any>,
        currentProps: P
      ): Record<string, any> => {
        const result: Record<string, any> = {};
        const globalState = globalUI ? { ui: globalUI } : {};

        for (const [key, value] of Object.entries(stateConfig)) {
          if (typeof value === 'function') {
            result[key] = value(currentProps, globalState);
          } else {
            result[key] = value;
          }
        }
        return result;
      }, [globalUI]);

      // Mount effect - runs once when component mounts
      useEffect(() => {
        const currentState = getIn(globalUI, uiPath);
        if (currentState === undefined && opts.state) {
          const defaults = evaluateDefaults(opts.state, props);
          dispatch(mountUI(uiPath, defaults, opts.reducer));
        }

        return () => {
          isMounted.current = false;
          if (opts.persist !== true) {
            // Use requestAnimationFrame to avoid issues with @connect selectors
            if (typeof window !== 'undefined' && window.requestAnimationFrame) {
              window.requestAnimationFrame(() => {
                dispatch(unmountUI(uiPath));
              });
            } else {
              dispatch(unmountUI(uiPath));
            }
          }
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      // Handle parent reset (when parent blows away our state)
      const prevGlobalUI = useRef(globalUI);
      useEffect(() => {
        if (prevGlobalUI.current !== globalUI) {
          const currentState = getIn(globalUI, uiPath);
          if (currentState === undefined && opts.state) {
            const defaults = evaluateDefaults(opts.state, props);
            dispatch(setDefaultUI(uiPath, defaults));
          }
          prevGlobalUI.current = globalUI;
        }
      });

      // updateUI callback
      const updateUICallback: UpdateUIFunction = useCallback((
        nameOrUpdates: string | Record<string, any>,
        value?: any
      ) => {
        if (typeof nameOrUpdates === 'object' && value === undefined) {
          // Mass update
          dispatch(massUpdateUI(uiVars, nameOrUpdates));
          return;
        }

        const name = nameOrUpdates as string;
        const uiVarPath = uiVars[name];

        invariant(
          uiVarPath,
          `The '${name}' UI variable is not defined in the UI context in "` +
          getDisplayName(WrappedComponent) + '" ' +
          'or any parent UI context. Set this variable using the "state" ' +
          'option in the @ui decorator before using it.'
        );

        dispatch(updateUI(uiVarPath, name, value));
      }, [uiVars, dispatch]);

      // resetUI callback
      const resetUI = useCallback(() => {
        if (opts.state) {
          const defaults = evaluateDefaults(opts.state, props);
          dispatch(setDefaultUI(uiPath, defaults));
        }
      }, [uiPath, dispatch, evaluateDefaults, props]);

      // Merge UI props from all scopes
      const previousMergedUI = useRef<Record<string, any>>({});
      const mergedUI = useMemo(() => {
        const result: Record<string, any> = {};

        for (const [varName, varPath] of Object.entries(uiVars)) {
          result[varName] = getIn(globalUI, [...varPath, varName]);
        }

        // Use previous result if shallowly equal (prevents unnecessary re-renders)
        if (shallowEqual(previousMergedUI.current, result)) {
          return previousMergedUI.current;
        }

        previousMergedUI.current = result;
        return result;
      }, [globalUI, uiVars]);

      // Context value for children
      const contextValue: UIContextValue = useMemo(() => ({
        uiKey: componentKey,
        uiPath,
        uiVars,
        updateUI: updateUICallback,
        resetUI
      }), [componentKey, uiPath, uiVars, updateUICallback, resetUI]);

      return (
        <ReduxUIStoreContext.Provider value={contextValue}>
          <WrappedComponent
            {...props}
            ui={mergedUI as S}
            uiKey={componentKey}
            uiPath={uiPath}
            updateUI={updateUICallback}
            resetUI={resetUI}
          />
        </ReduxUIStoreContext.Provider>
      );
    }

    UIWrapper.displayName = `UI(${getDisplayName(WrappedComponent)})`;

    return UIWrapper;
  };
}
```

**Step 2: Delete old ui.js**

Run: `rm /Users/zoamel/Workspace/redux-ui/src/ui.js`

**Step 3: Run tests**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm test`

Expected: Most tests pass. Debug any failures.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: rewrite UI HOC with React hooks"
```

---

## Phase 8: Index Update

### Task 8: Update index exports

**Files:**
- Modify: `src/index.js` → rename to `src/index.ts`

**Step 1: Create src/index.ts**

```typescript
// src/index.ts
'use strict';

import ui from './ui';
import reducer from './action-reducer';
import { ReduxUIStoreContext } from './context';

// Re-export everything from action-reducer for backward compatibility
export {
  reducer,
  ReduxUIStoreContext,
  // Export action creators and types for advanced usage
  updateUI,
  massUpdateUI,
  setDefaultUI,
  mountUI,
  unmountUI,
  reducerEnhancer,
  defaultState,
  UPDATE_UI_STATE,
  MASS_UPDATE_UI_STATE,
  SET_DEFAULT_UI_STATE
} from './action-reducer';

export { ReduxUIStoreContext } from './context';
export type { UIOptions, UIProps, UIState, UIContextValue } from './types';

export default ui;
```

**Step 2: Delete old index.js**

Run: `rm /Users/zoamel/Workspace/redux-ui/src/index.js`

**Step 3: Update package.json main entry**

Change `"main": "transpiled/index.js"` to point to the transpiled TypeScript output. The build step will handle this.

**Step 4: Run tests**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm test`

Expected: All tests pass

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: convert index to TypeScript and update exports"
```

---

## Phase 9: Build Configuration

### Task 9: Update build configuration

**Files:**
- Modify: `package.json`
- Modify: `.babelrc` or `babel.config.js`

**Step 1: Update package.json scripts**

```json
{
  "scripts": {
    "build": "tsc && babel transpiled --out-dir transpiled --extensions '.ts,.tsx'",
    "prepublish": "npm run build",
    "test": "mocha --compilers js:@babel/register --recursive --require ./test/setup.js"
  }
}
```

**Step 2: Add TypeScript preset to Babel**

Install: `npm install --save-dev @babel/preset-typescript`

Update `.babelrc` or `babel.config.js` to include TypeScript preset.

**Step 3: Run build**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm run build`

Expected: Build succeeds

**Step 4: Run tests**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm test`

Expected: All tests pass

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: update build configuration for TypeScript"
```

---

## Phase 10: Final Validation

### Task 10: Full validation

**Step 1: Run all tests**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm test`

Expected: All tests pass

**Step 2: Run build**

Run: `cd /Users/zoamel/Workspace/redux-ui && npm run build`

Expected: Build succeeds without errors

**Step 3: Verify no Immutable.js in production**

Run: `grep -r "from 'immutable'" src/`

Expected: No matches (Immutable.js removed from source)

**Step 4: Test compatibility shim deprecation warnings**

Create a temporary test file to verify warnings appear:

```javascript
// Manual test: verify deprecation warnings
const { createCompatibleState } = require('./transpiled/compat');
const state = createCompatibleState({ foo: 'bar' });
state.get('foo');  // Should log deprecation warning
state.set('foo', 'baz');  // Should log deprecation warning
```

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: complete redux-ui modernization - React hooks, TypeScript, plain objects"
```

---

## Summary Checklist

- [ ] Task 0: Verify existing tests pass (baseline)
- [ ] Task 1: Add TypeScript configuration
- [ ] Task 2: Create path utility functions
- [ ] Task 3: Create Immutable.js compatibility shim
- [ ] Task 4: Rewrite reducer with plain objects
- [ ] Task 5: Update utils.ts for plain objects
- [ ] Task 6: Update context file
- [ ] Task 7: Rewrite UI HOC with hooks
- [ ] Task 8: Update index exports
- [ ] Task 9: Update build configuration
- [ ] Task 10: Full validation

## Rollback Plan

If critical issues are found:

1. Tests serve as regression safety net throughout
2. Each task has a commit - can revert individual changes
3. Original implementation preserved in git history
4. Branch can be abandoned and restarted if needed
