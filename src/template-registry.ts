import type set from './helpers/set';
import type setPath from './helpers/set-path';

export default interface Registry {
  set: typeof set;
  'set-path': typeof setPath;
}
