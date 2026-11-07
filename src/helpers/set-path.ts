import { assert } from '@ember/debug';

function assign(target: object, path: string, value: unknown) {
  const keys = path.split('.');

  if (keys.includes('__proto__')) {
    throw new Error(
      `{{setPath}} does not set "${path}", because it has __proto__.`,
    );
  }

  const last = keys.pop()!;
  let object: unknown = target;

  for (const key of keys) {
    object = (object as Record<string, unknown>)[key];

    if (typeof object !== 'object' || object === null) {
      throw new Error(
        `{{setPath}} could not set "${path}": "${key}" is not an object.`,
      );
    }
  }

  (object as Record<string, unknown>)[last] = value;

  return value;
}

export default function setPath(
  target: object,
  path: string,
  value: unknown,
): () => unknown;
export default function setPath(
  target: object,
  path: string,
): (value: unknown) => unknown;
export default function setPath(
  target: object,
  path: string,
  ...rest: [unknown] | []
) {
  assert(
    'you must pass a path to {{setPath}}, as in `{{setPath this "user.name"}}`',
    typeof path === 'string' && path.split('.').every((key) => key.length > 0),
  );

  return rest.length === 1
    ? () => assign(target, path, rest[0])
    : (value: unknown) => assign(target, path, value);
}
