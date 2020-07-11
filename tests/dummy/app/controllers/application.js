import Controller from '@ember/controller';
import User from 'dummy/models/user';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('user', User.create({ name: 'Alice' }))
  }
})
