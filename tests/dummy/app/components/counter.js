import Component from '@ember/component';
import layout from '../templates/components/counter';

export default Component.extend({
  layout,

  count: 0,
  onUpdate: null,

  actions: {
    updateCount() {
      this.incrementProperty('count');

      if (this.onUpdate) {
        this.onUpdate(this.count);
      }
    },
  },
});
