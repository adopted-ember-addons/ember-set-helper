import Component from '@ember/component';
import layout from '../templates/components/counter';
import { action } from '@ember/object';

export default Component.extend({
  layout,

  count: 0,
  onUpdate: null,

  updateCount: action(function() {
    this.incrementProperty('count');

    if (this.onUpdate) {
      this.onUpdate(this.count);
    }
  }),
});
