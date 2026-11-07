import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, rerender } from '@ember/test-helpers';
import { concat } from '@ember/helper';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import setPath from '#src/helpers/set-path.ts';

class Person {
  @tracked name = '';
}

class Greetings {
  @tracked greeting1?: string;
  @tracked greeting2?: string;
}

class Keys {
  @tracked key: 'greeting1' | 'greeting2' = 'greeting1';
}

module('Integration | Helper | setPath', function (hooks) {
  setupRenderingTest(hooks);

  test('it sets a nested path', async function (assert) {
    const state = { user: new Person() };

    await render(
      <template>
        <span data-test-name>{{state.user.name}}</span>

        <button type="button" {{on "click" (setPath state "user.name" "Liz")}}>
          Set name
        </button>
      </template>,
    );

    await click('button');

    assert.dom('[data-test-name]').hasText('Liz');
  });

  test('it works with a dynamic path', async function (assert) {
    const keys = new Keys();
    const state = { greetings: new Greetings() };

    await render(
      <template>
        <span data-test-greeting1>{{state.greetings.greeting1}}</span>
        <span data-test-greeting2>{{state.greetings.greeting2}}</span>

        <button
          type="button"
          {{on "click" (setPath state (concat "greetings." keys.key) "Hello!")}}
        >
          Set greeting
        </button>
      </template>,
    );

    await click('button');

    assert.dom('[data-test-greeting1]').hasText('Hello!');

    keys.key = 'greeting2';
    await rerender();
    await click('button');

    assert.dom('[data-test-greeting2]').hasText('Hello!');
  });

  test('it sets a single key', function (assert) {
    const person = new Person();

    assert.strictEqual(setPath(person, 'name', 'Liz')(), 'Liz');
    assert.strictEqual(person.name, 'Liz');
  });

  test('it works without a value', function (assert) {
    const state = { user: new Person() };

    assert.strictEqual(setPath(state, 'user.name')('Bob'), 'Bob');
    assert.strictEqual(state.user.name, 'Bob');
  });

  test('it throws when an object on the path is missing', function (assert) {
    const state: { user?: Person } = {};

    assert.throws(
      () => setPath(state, 'user.name', 'Liz')(),
      /could not set "user.name": "user" is undefined/,
    );
  });

  test('it asserts on an empty key', function (assert) {
    assert.throws(() => setPath({}, 'user..name'), /you must pass a path/);
  });
});
