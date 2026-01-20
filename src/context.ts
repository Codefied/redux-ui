// src/context.ts
import React from 'react';
import type { UIContextValue } from './types';

export const ReduxUIStoreContext = React.createContext<UIContextValue>({});

// Re-export with old name for backward compatibility
export { ReduxUIStoreContext as default };
