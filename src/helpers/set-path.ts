import { assert } from '@ember/debug';

const unsafeKeys = new Set(['__proto__', 'constructor', 'prototype']);

function assign(target: object, path: string, value: unknown) {
  const keys = path.split('.');
  const last = keys.pop()!;
  let object: unknown = target;

  for (const key of keys) {
    object = (object as Record<string, unknown>)[key];

    if (object === null || object === undefined) {
      throw new Error(
        `{{setPath}} could not set "${path}": "${key}" is ${String(object)}.`,
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
    typeof path === 'string' &&
      path.length > 0 &&
      path.split('.').every((key) => key.length > 0),
  );

  const unsafeKey = path.split('.').find((key) => unsafeKeys.has(key));

  if (unsafeKey) {
    throw new Error(
      `{{setPath}} does not set "${path}", because "${unsafeKey}" can change the prototype of every object.`,
    );
  }

  return rest.length === 1
    ? () => assign(target, path, rest[0])
    : (value: unknown) => assign(target, path, value);
}
