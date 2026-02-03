import React, {
  useContext,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
  useState,
  ComponentType
} from 'react';
import { useSelector, useDispatch, useStore, shallowEqual } from 'react-redux';
import invariant from 'invariant';

import { updateUI, massUpdateUI, setDefaultUI, mountUI, unmountUI } from './action-reducer';
import { ReduxUIStoreContext } from './context';
import { getUIState } from './utils';
import { getIn } from './pathUtils';
import type { UIOptions, UIProps, UIContextValue, UpdateUIFunction } from './types';

// Maximum value for random key suffix (~1 billion, gives 8 hex chars)
const MAX_RANDOM_KEY = 1 << 30;

function getDisplayName(WrappedComponent: ComponentType<any>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function generateKey(WrappedComponent: ComponentType<any>): string {
  return (
    getDisplayName(WrappedComponent) +
    Math.floor(Math.random() * MAX_RANDOM_KEY).toString(16)
  );
}

export default function ui<S extends Record<string, any> = Record<string, any>>(
  keyOrOpts?: string | UIOptions<S>,
  opts: UIOptions<S> = {}
) {
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
      const store = useStore();

      // Read directly from store to avoid timing issues with useSelector on first render
      const getLatestUI = useCallback(() => getUIState(store.getState()), [store]);

      const componentKeyRef = useRef<string | null>(null);
      if (componentKeyRef.current === null) {
        componentKeyRef.current = opts.key ?? generateKey(WrappedComponent);
      }
      const componentKey = componentKeyRef.current;

      const parentPath = parentContext?.uiPath ?? [];
      const uiPath = useMemo(() => {
        return [...parentPath, componentKey];
      }, [parentPath.join('.'), componentKey]);

      // Child's local vars override parent's vars with the same name
      const uiVars = useMemo(() => {
        const parentVars = parentContext?.uiVars ?? {};
        const localVars: Record<string, string[]> = {};
        const stateKeys = Object.keys(opts.state ?? {});
        for (const k of stateKeys) {
          localVars[k] = uiPath;
        }
        return { ...parentVars, ...localVars };
      }, [parentContext?.uiVars, uiPath]);

      const evaluateDefaults = useCallback((
        stateConfig: Record<string, any>,
        currentProps: P
      ): Record<string, any> => {
        const result: Record<string, any> = {};
        const globalState = store.getState();

        for (const [key, value] of Object.entries(stateConfig)) {
          if (typeof value === 'function') {
            result[key] = value(currentProps, globalState);
          } else {
            result[key] = value;
          }
        }
        return result;
      }, [store]);

      const isInitializedRef = useRef(false);
      const isMountedRef = useRef(true);
      const [renderCount, forceUpdate] = useState(0);

      // Synchronous initialization during render
      // This is necessary because children need to see parent's state during their render
      // React will batch this dispatch with subsequent renders
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        const currentUI = getLatestUI();
        const currentState = getIn(currentUI, uiPath);
        if (currentState === undefined && opts.state) {
          const defaults = evaluateDefaults(opts.state, props);
          store.dispatch(mountUI(uiPath, defaults, opts.reducer));
        }
      }

      // Force re-render after initial mount to pick up dispatched state
      useLayoutEffect(() => {
        if (renderCount === 0) {
          forceUpdate(1);
        }
      }, [renderCount]);

      // Store uiPath in ref to capture value for cleanup closure
      // This prevents stale closure issues if uiPath were to change
      const uiPathRef = useRef(uiPath);
      uiPathRef.current = uiPath;

      useLayoutEffect(() => {
        return () => {
          isMountedRef.current = false;
          if (opts.persist !== true) {
            // requestAnimationFrame avoids issues with @connect selectors during unmount
            if (typeof window !== 'undefined' && window.requestAnimationFrame) {
              window.requestAnimationFrame(() => {
                dispatch(unmountUI(uiPathRef.current));
              });
            } else {
              dispatch(unmountUI(uiPathRef.current));
            }
          }
        };
        // Intentionally empty deps: cleanup runs only once on unmount.
        // We use uiPathRef.current to always get the latest path value.
        // dispatch is stable from useDispatch, opts.persist is captured at mount time.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const globalUI = useSelector(getUIState);

      // Restore defaults when parent's resetUI blows away our state
      const prevStateRef = useRef<any>(undefined);
      useLayoutEffect(() => {
        const latestState = getIn(getLatestUI(), uiPath);
        if (isInitializedRef.current && latestState === undefined && prevStateRef.current !== undefined && opts.state) {
          const defaults = evaluateDefaults(opts.state, props);
          dispatch(setDefaultUI(uiPath, defaults));
        }
        prevStateRef.current = latestState;
      });

      const updateUICallback: UpdateUIFunction = useCallback((
        nameOrUpdates: string | Record<string, any>,
        value?: any
      ) => {
        if (typeof nameOrUpdates === 'object' && value === undefined) {
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

      const resetUI = useCallback(() => {
        if (opts.state) {
          const defaults = evaluateDefaults(opts.state, props);
          dispatch(setDefaultUI(uiPath, defaults));
        }
      }, [uiPath, dispatch, evaluateDefaults, props]);

      const previousMergedUI = useRef<Record<string, any>>({});
      const mergedUI = useMemo(() => {
        const ui = getLatestUI();
        const result: Record<string, any> = {};

        for (const [varName, varPath] of Object.entries(uiVars)) {
          result[varName] = getIn(ui, [...varPath, varName]);
        }

        if (shallowEqual(previousMergedUI.current, result)) {
          return previousMergedUI.current;
        }

        previousMergedUI.current = result;
        return result;
        // Deps intentionally exclude previousMergedUI (ref, always current) - we only
        // want to recompute when the store changes (globalUI) or variable mappings change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [globalUI, uiVars, getLatestUI]);

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
