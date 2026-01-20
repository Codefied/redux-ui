'use strict';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import ui, { reducer } from '../../src';
import ReactTestUtils from 'react-dom/test-utils';

const store = createStore(combineReducers({ ui: reducer }));

/**
 * TestWrapper is a class component that wraps the Provider.
 * This is necessary because renderIntoDocument returns the instance
 * of the root component, and functional components don't have instances.
 * By wrapping in a class component, we can use findRenderedComponentWithType
 * to find nested class components in the tree.
 */
class TestWrapper extends Component {
  render() {
    return (
      <Provider store={ store }>
        { this.props.children }
      </Provider>
    );
  }
}

/**
 * Wrap given JSX with a provider contianing a store with the UI reducer
 */
const wrapWithProvider = (jsx) => (
  <TestWrapper>
    { jsx }
  </TestWrapper>
);

const render = (jsx) => {
  return ReactTestUtils.renderIntoDocument(
    wrapWithProvider(jsx)
  );
}

const renderAndFind = (jsx, type = null) => {
  if (type === undefined) {
    type = jsx;
    jsx = <jsx />
  }
  const tree = render(jsx);
  return ReactTestUtils.findRenderedComponentWithType(tree, type);
}

export {
  store,
  wrapWithProvider,
  render,
  renderAndFind
}
