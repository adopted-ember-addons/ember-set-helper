import { set as emberSet } from '@ember/object';
import { assert } from '@ember/debug';

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
    ? () => emberSet(target, path, maybeValue as T[K])
    : (value?: unknown) => emberSet(target, path, value as T[K]);
}
