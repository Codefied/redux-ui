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
