import { helper } from '@ember/component/helper';
import { set as emberSet } from '@ember/object';

function set(positional, named) {
  let [target, maybePath, maybeValue] = positional;

  let namedPath = named.path;

  let path;

  if (namedPath !== undefined) {
    path = maybePath !== undefined && maybePath !== '' ? `${maybePath}.${namedPath}` : namedPath;
  } else {
    path = maybePath;
  }

  if (path) {
    return positional.length === 3
      ? () => emberSet(target, path, maybeValue)
      : value => emberSet(target, path, value);
  }
}

export default helper(set);
