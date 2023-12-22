import { helper } from '@ember/component/helper';
import { set as emberSet } from '@ember/object';
import { assert } from '@ember/debug';

function set<T extends object, K extends keyof T>(positional: [T, K, T[K]]) {
  const [target, path, maybeValue] = positional;
  assert(
    'you must pass a path to {{set}}. You can pass a path statically, as in `{{set this "foo"}}`, or with the path dynamically, as in `{{set this this.greetingPath "Hello"}}`',
    (typeof path === 'string' && path.length > 0) ||
      typeof path === 'symbol' ||
      typeof path === 'number',
  );
  return positional.length === 3
    ? () => emberSet(target, path, maybeValue)
    : (value: T[K]) => emberSet(target, path, value);
}

export default helper(set);
