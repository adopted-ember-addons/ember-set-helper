import { assert } from '@ember/debug';

export default function set<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K],
): () => T[K];
export default function set<T extends object, K extends keyof T>(
  target: T,
  key: K,
): (value: T[K]) => T[K];
export default function set<T extends object, K extends keyof T>(
  target: T,
  key: K,
  ...rest: [T[K]] | []
) {
  assert(
    'you must pass a key to {{set}}. You can pass a key statically, as in `{{set this "foo"}}`, or dynamically, as in `{{set this this.greetingKey "Hello"}}`',
    (typeof key === 'string' && key.length > 0) ||
      typeof key === 'symbol' ||
      typeof key === 'number',
  );
  const assign = (value: T[K]) => {
    if (typeof key === 'string' && key.includes('.')) {
      throw new Error(
        `{{set}} sets one key, but got the path "${key}". Use setPath ({{set-path}} in a loose-mode template) for a nested path, or pass the nested object: {{set this.parent "child"}}`,
      );
    }

    return (target[key] = value);
  };

  return rest.length === 1 ? () => assign(rest[0]) : assign;
}
