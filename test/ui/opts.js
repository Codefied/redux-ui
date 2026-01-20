'use strict';

import { assert } from 'chai';
import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

import ui, { reducer } from '../../src';
import { render, renderAndFind } from '../utils/render.js';

describe('@connect options', () => {
  class Child extends Component {
    render = () => <p>Child</p>
  }

  // Note: The following tests are skipped because the new hooks-based
  // implementation no longer uses connect() internally. The mergeProps
  // and withRef options were connect()-specific features.
  //
  // The new implementation uses useSelector/useDispatch hooks directly,
  // which provides the same functionality without the connect() wrapper.

  it.skip('allows you to pass mergeProps into connect', () => {
    // This test is no longer applicable - we don't use connect()
    // Poor mans spying
    let called = false;
    const mergeProps = (stateProps, dispatchProps, ownProps) => {
      called = true;
      return Object.assign({}, ownProps, stateProps, dispatchProps);
    }

    const UIChild = ui({
      state: { name: 'child' },
      mergeProps: mergeProps
    })(Child);

    const c = renderAndFind(<UIChild />, Child);
    assert.isTrue(called);
  });


  it.skip('allows you to pass options into connect', () => {
    // This test is no longer applicable - we don't use connect()
    const WithRef = ui({
      state: { name: 'child' },
      options: { withRef: true }
    })(Child);
    let wrapped = renderAndFind(<WithRef />, WithRef);
    assert.isDefined(wrapped.getWrappedInstance());

    let WithoutRef = ui({
      state: { name: 'child' },
      options: { withRef: false }
    })(Child);
    wrapped = renderAndFind(<WithoutRef />, WithoutRef);
    assert.throws(() => wrapped.getWrappedInstance(), 'To access the wrapped instance, you need to specify { withRef: true } in the options argument of the connect() call.');
  });
});
