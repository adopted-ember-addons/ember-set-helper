import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';
import { get, set as emberSet } from '@ember/object';
import { Placeholder } from './__placeholder__';

function set(positional) {
  let [target, key, valueOrPlaceholder] = positional;
  assert(
    'you must pass a path and a value to the `(set)` helper. The value can be a defered value, using placeholder syntax, e.g. `(set this.value _)`',
    positional.length > 2
  );
  assert(
    'you cannot pass more than a path and a value to set',
    positional.length === 3
  );
  assert(
    'you must pass a path to {{set}}',
    (Boolean(target) && typeof key === 'string') || typeof key === 'symbol'
  );

  if (valueOrPlaceholder instanceof Placeholder) {
    return _value => {
      let path = valueOrPlaceholder.path;

      let value = path === null ? _value : get(_value, path);

      return emberSet(target, key, value);
    };
  } else {
    return () => emberSet(target, key, valueOrPlaceholder);
  }
}

export default helper(set);
