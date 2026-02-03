import React from 'react';
import type { UIContextValue } from './types';

export const ReduxUIStoreContext = React.createContext<UIContextValue>({});

export { ReduxUIStoreContext as default };
