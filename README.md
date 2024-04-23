# ember-set-helper

A better `mut` helper!

```hbs
{{this.greeting}}

<button {{on "click" (set this "greeting" "Hello!")}}>
  English
</button>

<button {{on "click" (fn (set this "greeting") "Hola!")}}>
  Español
</button>
```

## Usage

The `{{set}}` helper returns a function that sets a value. This can be used in
combination with Ember's `{{on}}` modifier or component actions to update state
without having to write your own custom action. For simple cases, this is pretty
handy:

```hbs
<button {{on "click" (set this "greeting" "Hello!")}}>
  English
</button>
```

### Import to strict mode templates
For usage in `gjs` or `gts` templates:

```js
import set from 'ember-set-helper/helpers/set'
```

### Setting Passed Values

If you do not provide a value to the `set` helper, it will set the value that is
provided to it when called. For example:

```hbs
<!-- app/components/counter.hbs -->
{{this.count}}

<button {{on "click" this.updateCount}}>Add 1</button>
```

```js
// app/components/counter.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Counter extends Component {
  @tracked count = 0;

  @action
  updateCount() {
    this.count++;

    if (this.args.onClick) {
      this.args.onClick(this.count);
    }
  }
}
```

```hbs
<!-- usage -->
<Counter @onClick={{set this "currentCount"}} />
```

This will set the value of `this.currentCount` to whatever value is passed to it
when it is called (in this case the `count` of the counter component whenever a
user clicks the button).

### Passing a dynamic path

You can pass a path dynamically using to the helper as well:

```hbs
<button {{on "click" (set this this.greetingPath "Hello!")}}>
  English
</button>
```

### Picking values with `ember-composable-helpers`

With the `{{action}}` helper and modifier, you could specify a value path using
the `value` named argument:

```hbs
<input {{on "input" (action (mut this.value) value="target.value"))}}/>
```

You can accomplish the same thing with `{{set}}` by using the `{{pick}}` helper
from [ember-composable-helpers](https://github.com/DockYard/ember-composable-helpers)
to first pick the value off of the event, and then pass it to `{{set}}`:

```hbs
<input {{on "input" (pick "target.value" (set this "value"))}}>
```

### Differences from `mut`

- No need to call wrap the helper (e.g. `(set this "foo")` === `(fn (mut this.foo))`)
- Optional last parameter if setting a static value (e.g. `(set this "foo" "bar")` === `(fn (mut this.foo) "bar")`)
- Cannot be used as both a getter and setter for the value, only provides a setter

## Compatibility

- Ember.js v3.4 or above
- Ember CLI v2.13 or above
- Node.js v8 or above

## Installation

```
ember install ember-set-helper
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
