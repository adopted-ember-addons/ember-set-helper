import { helper } from '@ember/component/helper';
import { DEBUG } from '@glimmer/env';

export class Placeholder {
  constructor(path) {
    this.path = path;

    if (DEBUG) {
      // just in case anybody tries to do anything crazy
      Object.seal(this);
    }
  }

  unknownProperty(key) {
    this.path = this.path === null ? key : `${this.path}.${key}`;

    return this;
  }
}

function setPlaceholder() {
  return new Placeholder(null);
}

export default helper(setPlaceholder);
