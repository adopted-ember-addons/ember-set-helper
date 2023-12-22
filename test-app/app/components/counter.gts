import Component from '@glimmer/component'
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier';

interface CounterSignature {
  Args: {
    onUpdate?: (count: number) => void;
  }
}

export default class Counter extends Component<CounterSignature> {
  @tracked count = 0;
 
  @action
  updateCount() {
    this.count += 1;
    this.args.onUpdate?.(this.count);
  }

  <template>
    <button type="button" {{on "click" this.updateCount}}>
      {{this.count}}
    </button>
  </template>
}
