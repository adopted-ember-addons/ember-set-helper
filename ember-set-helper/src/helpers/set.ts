import { assert } from '@ember/debug';

/**
 * Simplified set utility for nested paths with direct assignment.
 * Strips away classic Ember features (computed properties, observers, setUnknownProperty).
 * Only handles dot-separated paths for modern tracked properties.
 */
function setPath<T extends object, K extends keyof T>(
  obj: T,
  path: K,
  value: T[K] | undefined,
): T[K] | undefined {
  // Handle non-string paths (direct assignment)
  if (typeof path !== 'string') {
    obj[path] = value as T[K];
    return value;
  }

  // Handle nested paths
  const paths = path.split('.');
  const lastIndex = paths.length - 1;

  let nested: Record<string, unknown> = obj as Record<string, unknown>;
  for (let i = 0; i < lastIndex; i++) {
    const key = paths[i]!;
    const next = nested[key];

    // If intermediate path is null/undefined, we can't continue
    if (next == null) {
      return value;
    }

    nested = next as Record<string, unknown>;
  }

  // Set the final property
  const lastKey = paths[lastIndex]!;
  nested[lastKey] = value;
  return value;
}

// Overload: with value provided, returns a no-arg function
export default function set<T extends object, K extends keyof T & string>(
  target: T,
  path: K,
  maybeValue: T[K],
): () => T[K] | undefined;

// Overload: without value, returns a function that accepts a value
export default function set<T extends object, K extends keyof T & string>(
  target: T,
  path: K,
): (value?: unknown) => unknown;

// Implementation
export default function set<T extends object, K extends keyof T & string>(
  target: T,
  path: K,
  maybeValue?: T[K],
) {
  assert(
    'you must pass a path to {{set}}. You can pass a path statically, as in `{{set this "foo"}}`, or with the path dynamically, as in `{{set this this.greetingPath "Hello"}}`',
    (typeof path === 'string' && path.length > 0) ||
      typeof path === 'symbol' ||
      typeof path === 'number',
  );
  return arguments.length === 3
    ? () => setPath(target, path, maybeValue)
    : (value?: unknown) => setPath(target, path, value as T[K]);
}
