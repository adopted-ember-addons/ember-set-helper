import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';
import { set as emberSet } from '@ember/object';

function set(positional, named) {
  let [target, maybePath, maybeValue] = positional;

  let namedPath = named.path;

  let path;

  if (namedPath !== undefined) {
    path = maybePath !== undefined ? `${maybePath}.${namedPath}` : namedPath;
  } else {
    path = maybePath;
  }

  assert(
    'you must pass a path to {{set}}. You can pass a path statically, as in `{{set this.foo}}`, or with the path argument dynamically, as in `{{set this path="foo"}}`',
    Boolean(target) && (typeof path === 'string' && path.length > 0 || typeof path === 'symbol' || typeof path === 'number')
  );

  return positional.length === 3
    ? () => emberSet(target, path, maybeValue)
    : value => emberSet(target, path, value);
}

export default helper(set);
