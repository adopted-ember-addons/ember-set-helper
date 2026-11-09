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
import setPath from 'ember-set-helper/helpers/set-path'
```

or

```js
import { set, setPath } from 'ember-set-helper'
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

export default class Counter extends Component {
  @tracked count = 0;

  updateCount = () => {
    this.count++;
    this.args.onClick?.(this.count);
  };
}
```

```hbs
<!-- usage -->
<Counter @onClick={{set this "currentCount"}} />
```

This will set the value of `this.currentCount` to whatever value is passed to it
when it is called (in this case the `count` of the counter component whenever a
user clicks the button).

### Passing a dynamic key

You can pass the key dynamically as well:

```hbs
<button {{on "click" (set this this.greetingKey "Hello!")}}>
  English
</button>
```

### Tracked properties

`{{set}}` assigns the value with plain JavaScript (`target[key] = value`). The
template updates only if the property is `@tracked`, is a setter that writes
tracked state, or belongs to a tracked object such as `TrackedObject`.

### Nested paths

`{{set}}` sets one key. It throws when you call it with a key that has a dot.
For a nested property, pass the nested object:

```hbs
<button {{on "click" (set this.user "name" "Liz")}}>Set name</button>
```

If the path is dynamic, use `setPath` (`{{set-path}}` in a loose-mode
template). It reads each object on the path and assigns the last key. It throws
if a value on the path is not an object (for example `undefined` or a function),
or if the path contains `__proto__`:

```gjs
import { concat } from '@ember/helper';
import { on } from '@ember/modifier';
import { setPath } from 'ember-set-helper';

<template>
  <button {{on "click" (setPath @form (concat "user." @field) "Liz")}}>
    Set
  </button>
</template>
```

```hbs
<button {{on "click" (set-path @form (concat "user." @field) "Liz")}}>
  Set
</button>
```

## Upgrading from v3

v3 used `set` from `@ember/object`. v4 assigns with plain JavaScript:

- A property that is not tracked no longer updates the template. Make it
  `@tracked`.
- `{{set}}` takes one key. A nested path (`{{set this "user.name"}}`) throws
  when it is called. Pass the nested object (`{{set this.user "name"}}`), or use
  `setPath`.
- Classic observers do not run, and a computed property that depends on a
  property that is not tracked does not recompute. A computed property with a
  setter still runs its setter.
- Proxies (`ObjectProxy`, `PromiseProxyMixin`, such as an async `belongsTo`) and
  objects with `setUnknownProperty`, such as a classic changeset, do not forward
  the value, also when they are on a `setPath` path. The value is set on the
  wrapper. Set the content directly, or write an action that calls `set` from
  `@ember/object`.

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

- No need to wrap the helper (e.g. `(set this "foo")` instead of `(fn (mut this.foo))`)
- Optional last parameter if setting a static value (e.g. `(set this "foo" "bar")` instead of `(fn (mut this.foo) "bar")`)
- `mut` uses `set` from `@ember/object`, so it also updates a property that is not tracked. `set` does not.
- Cannot be used as both a getter and setter for the value, only provides a setter

## Compatibility

- Ember.js v4.5 or above. CI tests v4.8 and above.
- Ember.js v3.25 to v4.4 with [ember-functions-as-helper-polyfill](https://github.com/NullVoxPopuli/ember-functions-as-helper-polyfill), because `{{set}}` is a plain function helper.
- Embroider or ember-auto-import v2

## Installation

```
ember install ember-set-helper
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
