import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render, rerender } from '@ember/test-helpers';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { TOC } from '@ember/component/template-only';
import set from '#src/helpers/set.ts';

class Person {
  @tracked name = '';
}

class Greetings {
  @tracked greeting1?: string;
  @tracked greeting2?: string;
}

class Count {
  @tracked count?: number;
}

class Keys {
  @tracked key: 'greeting1' | 'greeting2' = 'greeting1';
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

const Parent: TOC<{ Args: { person: Person } }> = <template>
  <Child @onChange={{set @person "name"}} />
</template>;

const inputValue = (onValue: (value: string) => unknown) => (event: Event) =>
  onValue((event.target as HTMLInputElement).value);

module('Integration | Helper | set', function (hooks) {
  setupRenderingTest(hooks);

  test('it sets a value', async function (assert) {
    const person = new Person();

    await render(
      <template>
        <span data-test-name>{{person.name}}</span>

        <button type="button" {{on "click" (set person "name" "Liz")}}>
          Set name
        </button>
      </template>,
    );

    assert.dom('[data-test-name]').hasText('');

    await click('button');

    assert.dom('[data-test-name]').hasText('Liz');
  });

  test('it works with a dynamic key', async function (assert) {
    const keys = new Keys();
    const greetings = new Greetings();

    await render(
      <template>
        <span data-test-greeting1>{{greetings.greeting1}}</span>
        <span data-test-greeting2>{{greetings.greeting2}}</span>

        <button type="button" {{on "click" (set greetings keys.key "Hello!")}}>
          Set greeting
        </button>
      </template>,
    );

    await click('button');

    assert.dom('[data-test-greeting1]').hasText('Hello!');
    assert.dom('[data-test-greeting2]').hasText('');

    keys.key = 'greeting2';
    await rerender();
    await click('button');

    assert.dom('[data-test-greeting2]').hasText('Hello!');
  });

  test('it works without a value', async function (assert) {
    const counter = new Count();

    await render(
      <template>
        <span data-test-count>{{counter.count}}</span>
        <Counter @onUpdate={{set counter "count"}} />
      </template>,
    );

    assert.dom('[data-test-count]').hasText('');

    await click('button');
    await click('button');

    assert.dom('[data-test-count]').hasText('2');
  });

  test('it works without a value through a component argument', async function (assert) {
    const person = new Person();
    person.name = 'Alice';

    await render(
      <template>
        <span data-test-name>{{person.name}}</span>
        <Parent @person={{person}} />
      </template>,
    );

    assert.dom('[data-test-name]').hasText('Alice');

    await click('button');

    assert.dom('[data-test-name]').hasText('Bob');
  });

  test('it works with a value read from an event', async function (assert) {
    const person = new Person();

    await render(
      <template>
        <span data-test-name>{{person.name}}</span>

        <input
          aria-label="Name"
          {{on "input" (inputValue (set person "name"))}}
        />
      </template>,
    );

    await fillIn('input', 'Liz');

    assert.dom('[data-test-name]').hasText('Liz');
  });

  test('it returns the value', function (assert) {
    const person = new Person();

    assert.strictEqual(set(person, 'name', 'Liz')(), 'Liz');
    assert.strictEqual(set(person, 'name')('Bob'), 'Bob');
  });

  test('it asserts on a nested path', function (assert) {
    const person = new Person();

    assert.throws(
      // @ts-expect-error: a nested path is not a key of person
      () => set(person, 'name.first', 'Liz'),
      /Use setPath .* for a nested path/,
    );
  });
});
