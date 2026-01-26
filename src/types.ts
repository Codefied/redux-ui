export interface UIState {
  __reducers: Record<string, ReducerEntry>;
  [key: string]: any;
}

export interface ReducerEntry {
  path: string[];
  func: CustomReducer;
}

export type CustomReducer = (state: any, action: any) => any;

export interface UIOptions<S extends Record<string, any> = Record<string, any>> {
  key?: string;
  state?: S | Record<string, ((props: any, state: any) => any) | any>;
  persist?: boolean;
  reducer?: CustomReducer;
  mergeProps?: any;
  options?: any;
}

export interface UIProps<S extends Record<string, any> = Record<string, any>> {
  ui: S;
  uiKey: string;
  uiPath: string[];
  updateUI: UpdateUIFunction;
  resetUI: () => void;
}

export type UpdateUIFunction = {
  (name: string, value: any): void;
  (updates: Record<string, any>): void;
};

export interface UIContextValue {
  store?: any;
  uiKey?: string;
  uiPath?: string[];
  uiVars?: Record<string, string[]>;
  updateUI?: UpdateUIFunction;
  resetUI?: () => void;
}
