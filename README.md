# ember-set-helper

A better `mut` helper!

```hbs
{{this.greeting}}

<button {{on "click" (set this.greeting "Hello!")}}>
  English
</button>

<button
  value="Hola!"
  {{on "click" (set this.greeting (get _ "target.value"))}}
>
  Español
</button>
```

## Usage

The `{{set}}` helper returns a function that sets a value. This can be used in
combination with Ember's `{{on}}` modifier or component actions to update state
without having to write your own custom action. For simple cases, this is pretty
handy:

```hbs
<button {{on "click" (set this.greeting "Hello!")}}>
  English
</button>
```

You can also use object-key syntax:

```hbs
<button {{on "click" (set this "greeting" "Hello!")}}>
  English
</button>
```

### Placeholders

Oftentimes, you don't want to set a static value, but the value that is passed
to upwards by an action or event handler. For instance, you may have a `Counter`
component that sends an action whenever it updates its count:

```js
export default class Counter extends Component {
  @tracked count = 0;

  @action
  updateCount() {
    this.count++;

    if (this.args.onUpdate) {
      this.args.onUpdate(this.count);
    }
  }
}
```

If you want to capture this value using the `set` helper, you can provide a
_placeholder_, the `_` symbol, to the helper:

```hbs
<Counter @onUpdate={{set this.count _}} />
```

This placeholder will be replaced by the first argument to the function when it is
called. Placeholder syntax also works with Ember's built-in `{{get}}` helper:

```hbs
<button
  value="Hola!"
  {{on "click" (set this.greeting (get _ "target.value"))}}
>
  Español
</button>
```

This allows you to get values off of objects that are passed to `{{set}}`,
including native events passed to from the `{{on}}` modifier! In the future
placeholder syntax may also be usable with other helpers, but for the time being
only `{{get}}` is supported.

Placeholder syntax also only works within the `set` helper - elsewhere, the
symbol will remain a standard path. If you happen to use `_` in your application
today, installing `ember-set-helper` will not break your app.

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
