# Test TypeScript Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate all 10 test files from JavaScript to TypeScript for consistency with source code.

**Architecture:** Rename files to `.ts`/`.tsx`, add type definitions for Mocha/Chai, update tsconfig.json to include tests, and add minimal type annotations where TypeScript requires them.

**Tech Stack:** TypeScript 5.9.3, Mocha 2.5.3, Chai 3.5.0, React 17

---

### Task 1: Install Type Definitions

**Files:**
- Modify: `package.json`

**Step 1: Install @types/mocha and @types/chai**

Run: `npm install --save-dev @types/mocha@10.0.10 @types/chai@4.3.20`

Expected: package.json updated with new devDependencies

**Step 2: Verify installation**

Run: `npm ls @types/mocha @types/chai`
Expected: Shows both packages installed at specified versions

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @types/mocha and @types/chai for test TypeScript support"
```

---

### Task 2: Update TypeScript Configuration

**Files:**
- Modify: `tsconfig.json`

**Step 1: Update tsconfig.json to include test files**

Change `include` and `exclude` arrays:

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
    "rootDir": ".",
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
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "transpiled"]
}
```

Note: Changed `rootDir` from `./src` to `.` to allow both src and test directories.

**Step 2: Verify TypeScript accepts the config**

Run: `npx tsc --noEmit --project tsconfig.json`
Expected: No errors (or only errors from test files which we'll fix next)

**Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: update tsconfig to include test files"
```

---

### Task 3: Convert test/setup.js to TypeScript

**Files:**
- Rename: `test/setup.js` → `test/setup.ts`

**Step 1: Rename file**

Run: `mv test/setup.js test/setup.ts`

**Step 2: Add type declarations for global augmentation**

Update the file content:

```typescript
import { JSDOM } from 'jsdom'

// Configure Babel to handle TypeScript files
require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx']
});

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
})

// Augment global types for JSDOM globals
declare global {
  var document: Document;
  var window: Window & typeof globalThis;
  var navigator: Navigator;
}

global.document = dom.window.document
global.window = dom.window as unknown as Window & typeof globalThis

// Use Object.defineProperty to set navigator (works with modern Node.js)
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true
})
```

**Step 3: Update package.json test script**

Change the setup file reference:

```json
"test": "mocha --require @babel/register --recursive --require ./test/setup.ts"
```

**Step 4: Verify setup still works**

Run: `npm test`
Expected: Tests run (may fail on other files, but setup should load)

**Step 5: Commit**

```bash
git add test/setup.ts package.json
git rm test/setup.js
git commit -m "chore: convert test/setup.js to TypeScript"
```

---

### Task 4: Convert test/utils/render.js to TypeScript

**Files:**
- Rename: `test/utils/render.js` → `test/utils/render.tsx`

**Step 1: Rename file**

Run: `mv test/utils/render.js test/utils/render.tsx`

**Step 2: Add type annotations**

Update the file content:

```tsx
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
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/utils/render.tsx`
Expected: No errors

**Step 4: Commit**

```bash
git add test/utils/render.tsx
git rm test/utils/render.js
git commit -m "chore: convert test/utils/render.js to TypeScript"
```

---

### Task 5: Convert test/action-reducer/reducer.js to TypeScript

**Files:**
- Rename: `test/action-reducer/reducer.js` → `test/action-reducer/reducer.ts`

**Step 1: Rename file**

Run: `mv test/action-reducer/reducer.js test/action-reducer/reducer.ts`

**Step 2: The file needs no type annotations**

This file only uses:
- Chai assertions (typed via @types/chai)
- Mocha describe/it (typed via @types/mocha)
- Redux store (already typed)
- Plain objects

No changes needed to the file content.

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/action-reducer/reducer.ts`
Expected: No errors

**Step 4: Commit**

```bash
git add test/action-reducer/reducer.ts
git rm test/action-reducer/reducer.js
git commit -m "chore: convert test/action-reducer/reducer.js to TypeScript"
```

---

### Task 6: Convert test/ui/context.js to TypeScript

**Files:**
- Rename: `test/ui/context.js` → `test/ui/context.tsx`

**Step 1: Rename file**

Run: `mv test/ui/context.js test/ui/context.tsx`

**Step 2: Add type annotations for test components**

The file defines several test component classes. Add props interfaces:

```tsx
'use strict';

import { assert } from 'chai';
import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

import ui, { reducer } from '../../src';
import { UIProps } from '../../src/types';
import { render, renderAndFind } from '../utils/render';

describe('UI state context', () => {

  describe('single component tree', () => {
    interface TestProps extends UIProps {
      // No additional props needed
    }

    class Test extends Component<TestProps> {
      updateName() { this.props.updateUI('name', 'test'); }
      massUpdate() {
        this.props.updateUI({
          name: 'test',
          isValid: false
        });
      }
      render() { return <p>Hi</p>; }
    }
    // ... rest of file unchanged
```

Apply similar pattern to all component classes in the file:
- `Parent` class needs `UIProps & { children?: React.ReactNode }`
- `Child` class needs `UIProps`
- `Foo` and `Bar` classes need `UIProps`

**Step 3: Update import path**

Remove `.js` extension from render import:
```tsx
import { render, renderAndFind } from '../utils/render';
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/ui/context.tsx`
Expected: No errors

**Step 5: Commit**

```bash
git add test/ui/context.tsx
git rm test/ui/context.js
git commit -m "chore: convert test/ui/context.js to TypeScript"
```

---

### Task 7: Convert test/ui/reset.js to TypeScript

**Files:**
- Rename: `test/ui/reset.js` → `test/ui/reset.tsx`

**Step 1: Rename file**

Run: `mv test/ui/reset.js test/ui/reset.tsx`

**Step 2: Add type annotations**

```tsx
'use strict';

import { assert } from 'chai';
import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

import ui, { reducer } from '../../src';
import { UIProps } from '../../src/types';
import { render, renderAndFind } from '../utils/render';

describe('resetting UI state', () => {
  interface ParentProps extends UIProps {
    children?: React.ReactNode;
  }

  class Parent extends Component<ParentProps> {
    render = () => (<div>{ this.props.children }</div>)
  }

  interface ChildProps extends UIProps {
    value?: string;
  }

  class Child extends Component<ChildProps> {
    render = () => <p>Child</p>
  }
  // ... rest unchanged
```

**Step 3: Update import path**

Remove `.js` extension from render import.

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/ui/reset.tsx`
Expected: No errors

**Step 5: Commit**

```bash
git add test/ui/reset.tsx
git rm test/ui/reset.js
git commit -m "chore: convert test/ui/reset.js to TypeScript"
```

---

### Task 8: Convert test/ui/reducer.js to TypeScript

**Files:**
- Rename: `test/ui/reducer.js` → `test/ui/reducer.tsx`

**Step 1: Rename file**

Run: `mv test/ui/reducer.js test/ui/reducer.tsx`

**Step 2: Add type annotations**

```tsx
'use strict';

import { assert } from 'chai';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

import ui, { reducer } from '../../src';
import { UIProps } from '../../src/types';
import { store, render, renderAndFind } from '../utils/render';

describe('with a custom reducer', () => {

  interface ParentProps extends UIProps {
    children?: React.ReactNode;
  }

  class Parent extends Component<ParentProps> {
    render = () => <div>{ this.props.children }</div>
  }
  // ... rest unchanged
```

**Step 3: Update import path**

Remove `.js` extension from render import.

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/ui/reducer.tsx`
Expected: No errors

**Step 5: Commit**

```bash
git add test/ui/reducer.tsx
git rm test/ui/reducer.js
git commit -m "chore: convert test/ui/reducer.js to TypeScript"
```

---

### Task 9: Convert test/ui/key.js to TypeScript

**Files:**
- Rename: `test/ui/key.js` → `test/ui/key.tsx`

**Step 1: Rename file**

Run: `mv test/ui/key.js test/ui/key.tsx`

**Step 2: Add type annotations**

```tsx
'use strict';

import { assert } from 'chai';
import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import ui, { reducer } from '../../src';
import { UIProps } from '../../src/types';
import { render, renderAndFind } from '../utils/render';

describe('key generation', () => {

  class Test extends Component<UIProps> {
    render() { return <p>Hi</p>; }
  }
  // ... rest unchanged
```

**Step 3: Update import path**

Remove `.js` extension from render import.

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/ui/key.tsx`
Expected: No errors

**Step 5: Commit**

```bash
git add test/ui/key.tsx
git rm test/ui/key.js
git commit -m "chore: convert test/ui/key.js to TypeScript"
```

---

### Task 10: Convert test/ui/opts.js to TypeScript

**Files:**
- Rename: `test/ui/opts.js` → `test/ui/opts.tsx`

**Step 1: Rename file**

Run: `mv test/ui/opts.js test/ui/opts.tsx`

**Step 2: Add type annotations**

```tsx
'use strict';

import { assert } from 'chai';
import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

import ui, { reducer } from '../../src';
import { UIProps } from '../../src/types';
import { render, renderAndFind } from '../utils/render';

describe('@connect options', () => {
  class Child extends Component<UIProps> {
    render = () => <p>Child</p>
  }
  // ... rest unchanged
```

**Step 3: Update import path**

Remove `.js` extension from render import.

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/ui/opts.tsx`
Expected: No errors

**Step 5: Commit**

```bash
git add test/ui/opts.tsx
git rm test/ui/opts.js
git commit -m "chore: convert test/ui/opts.js to TypeScript"
```

---

### Task 11: Convert test/ui/defaults.js to TypeScript

**Files:**
- Rename: `test/ui/defaults.js` → `test/ui/defaults.tsx`

**Step 1: Rename file**

Run: `mv test/ui/defaults.js test/ui/defaults.tsx`

**Step 2: Add type annotations**

```tsx
'use strict';

import { assert } from 'chai';
import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import ui, { reducer } from '../../src';
import { UIProps } from '../../src/types';
import { render, renderAndFind } from '../utils/render';

describe('Default UI state variables', () => {

  describe('HOC is passed props and state to calculate defaults', () => {
    let calcProps: any, calcState: any;

    interface TestProps extends UIProps {
      passedProp?: string;
    }

    class Test extends Component<TestProps> {
      render() { return <p>Hi</p>; }
    }
    // ... rest unchanged
```

**Step 3: Update import path**

Remove `.js` extension from render import.

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/ui/defaults.tsx`
Expected: No errors

**Step 5: Commit**

```bash
git add test/ui/defaults.tsx
git rm test/ui/defaults.js
git commit -m "chore: convert test/ui/defaults.js to TypeScript"
```

---

### Task 12: Convert test/ui/validation.js to TypeScript

**Files:**
- Rename: `test/ui/validation.js` → `test/ui/validation.tsx`

**Step 1: Rename file**

Run: `mv test/ui/validation.js test/ui/validation.tsx`

**Step 2: Add type annotations**

```tsx
'use strict';

import { assert } from 'chai';
import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

import ui, { reducer } from '../../src';
import { UIProps } from '../../src/types';
import { render, renderAndFind } from '../utils/render';

describe('Prop validation', () => {
  class Child extends Component<UIProps> {
    render = () => <p>Child</p>
  }
  // ... rest unchanged
```

**Step 3: Update import path**

Remove `.js` extension from render import.

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit test/ui/validation.tsx`
Expected: No errors

**Step 5: Commit**

```bash
git add test/ui/validation.tsx
git rm test/ui/validation.js
git commit -m "chore: convert test/ui/validation.js to TypeScript"
```

---

### Task 13: Final Verification

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 2: Run TypeScript type check on entire test directory**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: complete test TypeScript migration"
```

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Install type definitions | package.json |
| 2 | Update tsconfig.json | tsconfig.json |
| 3 | Convert setup.js | test/setup.ts |
| 4 | Convert render.js | test/utils/render.tsx |
| 5 | Convert action-reducer/reducer.js | test/action-reducer/reducer.ts |
| 6 | Convert ui/context.js | test/ui/context.tsx |
| 7 | Convert ui/reset.js | test/ui/reset.tsx |
| 8 | Convert ui/reducer.js | test/ui/reducer.tsx |
| 9 | Convert ui/key.js | test/ui/key.tsx |
| 10 | Convert ui/opts.js | test/ui/opts.tsx |
| 11 | Convert ui/defaults.js | test/ui/defaults.tsx |
| 12 | Convert ui/validation.js | test/ui/validation.tsx |
| 13 | Final verification | - |
