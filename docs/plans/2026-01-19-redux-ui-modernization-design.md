# Redux-UI Modernization Design

**Date**: 2026-01-19
**Status**: Approved
**Branch**: `feat/fp-1561-redux-ui-rewrite`

## Overview

Replace the current redux-ui implementation with a fully custom, modernized version tailored to project needs. The rewrite uses React 17+ hooks internally while maintaining full backward API compatibility so consumers don't need to change anything.

## Goals

- Modernize internals using React hooks (functional components)
- Remove Immutable.js dependency (use plain objects)
- Add TypeScript with moderate strictness
- Ensure compatibility with React 17 and 18
- Maintain 100% backward API compatibility

## Non-Goals

- Exposing a public hooks API (planned sunset of this library)
- Supporting React < 17
- Major API changes

## Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| React version | 17+ only | Enables hooks, cleaner implementation |
| Public API | HOC/decorator only | No new API to discourage adoption before sunset |
| Immutable.js | Remove + compatibility shim | Reduces bundle size; shim prevents breaking 30+ custom reducers |
| TypeScript | Moderate strictness | Balance between safety and pragmatism; can defer if needed |
| Testing | Keep Mocha during rewrite, migrate to Jest last | Existing tests validate backward compatibility |

## Public API (Unchanged)

```js
// Exports remain identical
import ui, { reducer, ReduxUIStoreContext } from 'redux-ui';

// Decorator/HOC usage unchanged
@ui({
  key: 'myComponent',
  state: { filter: '', isOpen: false },
  persist: true,
  reducer: (state, action) => { ... },
  mergeProps: ...,
  options: ...
})
class MyComponent extends Component {
  // Props injected: ui, updateUI, resetUI, uiKey, uiPath
}
```

## Architecture

### File Structure

```
src/
├── index.ts           # Public exports
├── ui.tsx             # Main HOC (functional rewrite)
├── reducer.ts         # Redux reducer (plain objects)
├── context.ts         # React context
├── utils.ts           # Helpers (getUIState, path utilities)
├── compat.ts          # Immutable.js compatibility shim
└── types.ts           # TypeScript types
```

### Immutable.js Compatibility Shim

Custom reducers currently use Immutable.js methods like `state.set()`. To avoid breaking 30+ usages across projects, we provide a compatibility wrapper.

```ts
// src/compat.ts

interface CompatibleState<T extends Record<string, any>> {
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
}

function createCompatibleState<T extends Record<string, any>>(
  plainState: T
): T & CompatibleState<T> {
  // Implementation with runtime deprecation warnings (one-time per method)
}
```

Features:
- IDE strikethrough and deprecation messages via JSDoc `@deprecated`
- Runtime console warnings (one-time per method, not per call)
- Allows gradual migration without breaking existing code

### Reducer (Plain Objects)

Replace Immutable.js `Map` operations with plain object helpers.

```ts
// src/reducer.ts

export const defaultState: UIState = {
  __reducers: {}
};

export default function reducer(state = defaultState, action: UIAction): UIState {
  const key = action.payload?.key ?? [];
  const path = Array.isArray(key) ? key : [key];

  switch (action.type) {
    case UPDATE_UI_STATE: {
      const { name, value } = action.payload;
      if (typeof value === 'function') {
        const current = getIn(state, [...path, name]);
        return setIn(state, [...path, name], value(current));
      }
      return setIn(state, [...path, name], value);
    }

    case MASS_UPDATE_UI_STATE: {
      const { uiVars, transforms } = action.payload;
      let newState = state;
      for (const k of Object.keys(transforms)) {
        const varPath = uiVars[k];
        invariant(varPath, `UI variable ${k} not defined in context`);
        newState = setIn(newState, [...varPath, k], transforms[k]);
      }
      return newState;
    }

    case SET_DEFAULT_UI_STATE:
      return setIn(state, path, action.payload.value);

    case MOUNT_UI_STATE: {
      const { defaults, customReducer } = action.payload;
      let newState = setIn(state, path, { ...defaults });
      if (customReducer) {
        const reducerKey = path.join('.');
        newState = setIn(newState, ['__reducers', reducerKey], {
          path,
          func: customReducer
        });
      }
      return newState;
    }

    case UNMOUNT_UI_STATE: {
      let newState = deleteIn(state, path);
      return deleteIn(newState, ['__reducers', path.join('.')]);
    }

    default:
      return state;
  }
}
```

### HOC Rewrite (Functional + Hooks)

Replace class component with functional component using hooks internally.

```tsx
// src/ui.tsx

export default function ui<S extends Record<string, any>>(
  keyOrOpts?: string | UIOptions<S>,
  opts: UIOptions<S> = {}
) {
  // Normalize arguments
  if (typeof keyOrOpts === 'object') {
    opts = keyOrOpts;
  } else if (typeof keyOrOpts === 'string') {
    opts = { ...opts, key: keyOrOpts };
  }

  return function wrapWithUI<P extends object>(
    WrappedComponent: React.ComponentType<P & UIProps<S>>
  ) {
    function UIWrapper(props: P) {
      const parentContext = useContext(ReduxUIStoreContext);
      const dispatch = useDispatch();
      const globalUI = useSelector(getUIState);

      // Generate stable key (once per mount)
      const componentKey = useMemo(() => {
        return opts.key ?? generateKey(WrappedComponent);
      }, []);

      // Calculate paths based on parent context
      const uiPath = useMemo(() => {
        const parentPath = parentContext?.uiPath ?? [];
        return [...parentPath, componentKey];
      }, [parentContext?.uiPath, componentKey]);

      const uiVars = useMemo(() => {
        const parentVars = parentContext?.uiVars ?? {};
        const localVars: Record<string, string[]> = {};
        for (const k of Object.keys(opts.state ?? {})) {
          localVars[k] = uiPath;
        }
        return { ...parentVars, ...localVars };
      }, [parentContext?.uiVars, uiPath]);

      // Mount/unmount effects
      useEffect(() => {
        const currentState = globalUI?.[componentKey];
        if (currentState === undefined && opts.state) {
          const defaults = evaluateDefaults(opts.state, props);
          dispatch(mountUI(uiPath, defaults, opts.reducer));
        }

        return () => {
          if (opts.persist !== true) {
            dispatch(unmountUI(uiPath));
          }
        };
      }, []);

      // Callbacks
      const updateUI = useCallback((name, value) => { ... }, [uiVars]);
      const resetUI = useCallback(() => { ... }, [uiPath]);

      // Merge UI props from all scopes
      const mergedUI = useMergedUIProps(globalUI, uiVars);

      // Provide context to children
      const contextValue = useMemo(() => ({
        uiKey: componentKey,
        uiPath,
        uiVars,
        updateUI,
        resetUI
      }), [componentKey, uiPath, uiVars, updateUI, resetUI]);

      return (
        <ReduxUIStoreContext.Provider value={contextValue}>
          <WrappedComponent
            {...props}
            ui={mergedUI}
            uiKey={componentKey}
            uiPath={uiPath}
            updateUI={updateUI}
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

Key changes from current implementation:
- `useEffect` replaces `UNSAFE_componentWillMount` and `componentWillUnmount`
- `useMemo` / `useCallback` for stable references
- `useSelector` / `useDispatch` from react-redux (no manual `connect()`)

## Implementation Phases

### Phase 1: Core Rewrite
- Set up TypeScript configuration
- Implement plain object utilities (`getIn`, `setIn`, `deleteIn`)
- Rewrite reducer with plain objects
- Run existing Mocha tests to validate

### Phase 2: Compatibility Shim
- Implement `createCompatibleState` wrapper
- Add `@deprecated` JSDoc comments
- Add one-time runtime deprecation warnings
- Integrate shim into reducer for custom reducer calls

### Phase 3: HOC Rewrite
- Rewrite UI HOC as functional component
- Replace lifecycle methods with hooks
- Maintain context inheritance behavior
- Run existing Mocha tests to validate

### Phase 4: Validation
- Run full existing test suite
- Fix any regressions
- Manual testing in consuming projects

### Phase 5: TypeScript (If Time Permits)
- Add types for public API
- Add types for internal utilities
- Moderate strictness (allow `any` in complex areas)

### Phase 6: Test Migration
- Set up Jest + React Testing Library
- Rewrite tests (fresh, not converted)
- Remove Mocha/Chai dependencies

## Migration Guide for Custom Reducers

Existing custom reducers using Immutable.js methods will continue to work but show deprecation warnings.

**Before (still works, but deprecated)**:
```js
reducer: (state, action) => {
  return state.set('serverError', action.errorText);
}
```

**After (recommended)**:
```js
reducer: (state, action) => {
  return { ...state, serverError: action.errorText };
}
```

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking custom reducers | Compatibility shim with deprecation warnings |
| Subtle behavior changes | Run existing tests throughout development |
| React 17/18 differences | Test on both versions |
| Performance regression | Profile critical paths, use memoization |

## Success Criteria

- [ ] All existing Mocha tests pass
- [ ] No Immutable.js dependency in production bundle
- [ ] No React deprecation warnings
- [ ] Custom reducers work with compatibility shim
- [ ] Works with React 17 and 18
