// src/pathUtils.ts

/**
 * Get a deeply nested value from an object by path.
 * Similar to Immutable.js getIn().
 */
export function getIn(obj: any, path: string[]): any {
  if (!path || path.length === 0) {
    return obj;
  }

  let current = obj;
  for (const key of path) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

/**
 * Set a deeply nested value in an object by path, returning a new object.
 * Similar to Immutable.js setIn().
 */
export function setIn<T>(obj: T, path: string[], value: any): T {
  if (!path || path.length === 0) {
    return value;
  }

  const [head, ...tail] = path;
  const currentValue = (obj as any)?.[head];

  if (tail.length === 0) {
    // Base case: set the value at this key
    return {
      ...obj,
      [head]: value
    } as T;
  }

  // Recursive case: continue down the path
  return {
    ...obj,
    [head]: setIn(currentValue ?? {}, tail, value)
  } as T;
}

/**
 * Delete a deeply nested value from an object by path, returning a new object.
 * Similar to Immutable.js deleteIn().
 */
export function deleteIn<T>(obj: T, path: string[]): T {
  if (!path || path.length === 0 || obj === null || obj === undefined) {
    return obj;
  }

  const [head, ...tail] = path;

  if (tail.length === 0) {
    // Base case: delete the key at this level
    const { [head]: _, ...rest } = obj as any;
    return rest as T;
  }

  // Recursive case: continue down the path
  const currentValue = (obj as any)?.[head];
  if (currentValue === undefined) {
    return obj;
  }

  return {
    ...obj,
    [head]: deleteIn(currentValue, tail)
  } as T;
}
