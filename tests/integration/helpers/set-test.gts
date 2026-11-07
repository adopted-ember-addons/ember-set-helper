import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render, rerender } from '@ember/test-helpers';
import { concat, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import EmberObject from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { TOC } from '@ember/component/template-only';
import set from '#src/helpers/set.ts';

class User extends EmberObject {
  name = '';
}

class Counter extends Component<{
  Args: { onUpdate?: (count: number) => void };
}> {
  @tracked count = 0;

  updateCount = () => {
    this.count += 1;
    this.args.onUpdate?.(this.count);
  };

  <template>
    <button type="button" {{on "click" this.updateCount}}>
      {{this.count}}
    </button>
  </template>
}

const Child: TOC<{ Args: { onChange: (name: string) => void } }> = <template>
  <button type="button" {{on "click" (fn @onChange "Bob")}}>Click to become Bob!</button>
</template>;

const Parent: TOC<{ Args: { user: User } }> = <template>
  <Child @onChange={{set @user "name"}} />
</template>;

const UpdateParameter: TOC<{
  Args: {
    parameter: { greeting1?: number; greeting2?: number };
    path: 'greeting1' | 'greeting2';
  };
}> = <template>
  <button type="button" {{on "click" (set @parameter @path 42)}}>
    Update
  </button>
</template>;

const inputValue = (onValue: (value: string) => unknown) => (event: Event) =>
  onValue((event.target as HTMLInputElement).value);

class Paths {
  @tracked path: 'greeting1' | 'greeting2' = 'greeting1';
}

module('Integration | Helper | set', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    const state: { greeting?: string } = {};

    await render(
      <template>
        <span data-test-greeting>{{state.greeting}}</span>

        <button type="button" {{on "click" (set state "greeting" "Hello!")}}>
          English
        </button>
      </template>,
    );

    assert.dom('[data-test-greeting]').hasText('');

    await click('button');

    assert.dom('[data-test-greeting]').hasText('Hello!');
  });

  test('it works on local paths', async function (assert) {
    const state: { person: { name?: string } } = { person: {} };

    await render(
      <template>
        <span data-test-greeting>{{state.person.name}}</span>

        {{#let state.person as |person|}}
          <button type="button" {{on "click" (set person "name" "Liz")}}>
            Set Name
          </button>
        {{/let}}
      </template>,
    );

    assert.dom('[data-test-greeting]').hasText('');

    await click('button');

    assert.dom('[data-test-greeting]').hasText('Liz');
  });

  test('it works with a dynamic path', async function (assert) {
    const paths = new Paths();
    const state: { greeting1?: string; greeting2?: string } = {};

    await render(
      <template>
        <span data-test-greeting1>{{state.greeting1}}</span>
        <span data-test-greeting2>{{state.greeting2}}</span>

        <button type="button" {{on "click" (set state paths.path "Hello!")}}>
          Set Greeting
        </button>
      </template>,
    );

    assert.dom('[data-test-greeting1]').hasText('');
    assert.dom('[data-test-greeting2]').hasText('');

    await click('button');

    assert.dom('[data-test-greeting1]').hasText('Hello!');

    paths.path = 'greeting2';
    await rerender();
    await click('button');

    assert.dom('[data-test-greeting2]').hasText('Hello!');
  });

  test('it works with a dynamic path on a nested object', async function (assert) {
    const paths = new Paths();
    const state: { obj: { greeting1?: string; greeting2?: string } } = {
      obj: {},
    };

    await render(
      <template>
        <span data-test-greeting1>{{state.obj.greeting1}}</span>
        <span data-test-greeting2>{{state.obj.greeting2}}</span>

        <button
          type="button"
          {{! @glint-expect-error: a nested path is not a key of state }}
          {{on "click" (set state (concat "obj." paths.path) "Hello!")}}
        >
          Set Greeting
        </button>
      </template>,
    );

    assert.dom('[data-test-greeting1]').hasText('');
    assert.dom('[data-test-greeting2]').hasText('');

    await click('button');

    assert.dom('[data-test-greeting1]').hasText('Hello!');

    paths.path = 'greeting2';
    await rerender();
    await click('button');

    assert.dom('[data-test-greeting2]').hasText('Hello!');
  });

  test('it works with a dynamic path on a component argument', async function (assert) {
    const paths = new Paths();
    const obj: { greeting1?: number; greeting2?: number } = {};

    await render(
      <template>
        <UpdateParameter @parameter={{obj}} @path={{paths.path}} />
      </template>,
    );

    await click('button');

    assert.strictEqual(obj.greeting1, 42);

    paths.path = 'greeting2';
    await rerender();
    await click('button');

    assert.strictEqual(obj.greeting2, 42);
  });

  test('it works without a value', async function (assert) {
    const state: { count?: number } = {};

    await render(
      <template>
        <span data-test-count>{{state.count}}</span>
        <Counter @onUpdate={{set state "count"}} />
      </template>,
    );

    assert.dom('[data-test-count]').hasText('');

    await click('button');
    await click('button');

    assert.dom('[data-test-count]').hasText('2');
  });

  test('it works without a value on an object', async function (assert) {
    const user = User.create({ name: 'Alice' });

    await render(
      <template>
        <span data-test-name>{{user.name}}</span>
        <Parent @user={{user}} />
      </template>,
    );

    assert.dom('[data-test-name]').hasText('Alice');

    await click('button');

    assert.dom('[data-test-name]').hasText('Bob');
  });

  test('it works with a value read from an event', async function (assert) {
    const state: { greeting?: string } = {};

    await render(
      <template>
        <span data-test-greeting>{{state.greeting}}</span>

        <input
          aria-label="Greeting"
          {{on "input" (inputValue (set state "greeting"))}}
        />
      </template>,
    );

    assert.dom('[data-test-greeting]').hasText('');

    await fillIn('input', 'Hello!');

    assert.dom('[data-test-greeting]').hasText('Hello!');
  });
});
