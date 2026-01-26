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
