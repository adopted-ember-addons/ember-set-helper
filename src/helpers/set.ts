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
  assert(
    `{{set}} sets one key, but got the path "${String(key)}". Use setPath ({{set-path}} in a loose-mode template) for a nested path, or pass the nested object: {{set this.parent "child"}}`,
    typeof key !== 'string' || !key.includes('.'),
  );

  return rest.length === 1
    ? () => (target[key] = rest[0])
    : (value: T[K]) => (target[key] = value);
}
