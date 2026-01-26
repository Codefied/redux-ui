'use strict';

import React, { Component, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, Store } from 'redux';
import ui, { reducer } from '../../src';
import ReactTestUtils from 'react-dom/test-utils';

const store: Store = createStore(combineReducers({ ui: reducer }));

interface TestWrapperProps {
  children?: React.ReactNode;
}

/**
 * TestWrapper is a class component that wraps the Provider.
 * This is necessary because renderIntoDocument returns the instance
 * of the root component, and functional components don't have instances.
 * By wrapping in a class component, we can use findRenderedComponentWithType
 * to find nested class components in the tree.
 */
class TestWrapper extends Component<TestWrapperProps> {
  render() {
    return (
      <Provider store={ store }>
        { this.props.children }
      </Provider>
    );
  }
}

/**
 * Wrap given JSX with a provider containing a store with the UI reducer
 */
const wrapWithProvider = (jsx: ReactElement): ReactElement => (
  <TestWrapper>
    { jsx }
  </TestWrapper>
);

const render = (jsx: ReactElement): Component => {
  return ReactTestUtils.renderIntoDocument(
    wrapWithProvider(jsx)
  ) as Component;
}

const renderAndFind = <T extends Component>(
  jsx: ReactElement | React.ComponentClass<any>,
  type?: React.ComponentClass<any>
): T => {
  if (type === undefined) {
    type = jsx as React.ComponentClass<any>;
    jsx = React.createElement(type);
  }
  const tree = render(jsx as ReactElement);
  return ReactTestUtils.findRenderedComponentWithType(tree, type) as unknown as T;
}

export {
  store,
  wrapWithProvider,
  render,
  renderAndFind
}
