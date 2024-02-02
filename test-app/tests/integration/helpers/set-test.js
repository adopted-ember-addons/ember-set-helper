import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import User from 'test-app/models/user';

module('Integration | Helper | set', function(hooks) {
  setupRenderingTest(hooks);

  test('it works', async function(assert) {
    await render(hbs`
      <span data-test-greeting>{{this.greeting}}</span>

      <button type="button" {{on "click" (set this "greeting" "Hello!")}}>
        English
      </button>
    `);

    assert.equal(find('[data-test-greeting]').textContent.trim(), '');

    await click('button');

    assert.equal(find('[data-test-greeting]').textContent.trim(), 'Hello!');
  });

  test('it works on local paths', async function(assert) {
    this.person = {};

    await render(hbs`
      <span data-test-greeting>{{this.person.name}}</span>

      {{#let this.person as |person|}}
        <button type="button" {{on "click" (set person "name" "Liz")}}>
          Set Name
        </button>
      {{/let}}
    `);

    assert.equal(find('[data-test-greeting]').textContent.trim(), '');

    await click('button');

    assert.equal(find('[data-test-greeting]').textContent.trim(), 'Liz');
  });

  test('it works with a dynamic path', async function(assert) {
    this.set('path', 'greeting1');

    await render(hbs`
      <span data-test-greeting1>{{this.greeting1}}</span>
      <span data-test-greeting2>{{this.greeting2}}</span>

      <button type="button" {{on "click" (set this this.path "Hello!")}}>
        Set Greeting
      </button>
    `);

    assert.equal(find('[data-test-greeting1]').textContent.trim(), '');
    assert.equal(find('[data-test-greeting2]').textContent.trim(), '');

    await click('button');
    assert.equal(find('[data-test-greeting1]').textContent.trim(), 'Hello!');

    this.set('path', 'greeting2');
    await click('button');

    assert.equal(find('[data-test-greeting2]').textContent.trim(), 'Hello!');
  });

  test('it works with a dynamic path on a nested object', async function(assert) {
    this.set('path', 'greeting1');
    this.set('obj', {});

    await render(hbs`
      <span data-test-greeting1>{{this.obj.greeting1}}</span>
      <span data-test-greeting2>{{this.obj.greeting2}}</span>

      <button type="button" {{on "click" (set this (concat "obj." this.path) "Hello!")}}>
        Set Greeting
      </button>
    `);

    assert.equal(find('[data-test-greeting1]').textContent.trim(), '');
    assert.equal(find('[data-test-greeting2]').textContent.trim(), '');

    await click('button');

    assert.equal(find('[data-test-greeting1]').textContent.trim(), 'Hello!');

    this.set('path', 'greeting2');
    await click('button');

    assert.equal(find('[data-test-greeting2]').textContent.trim(), 'Hello!');
  });

  test('it works with a dynamic path on a component argument', async function(assert) {
    this.set('path', 'greeting1');
    this.set('obj', {});

    await render(hbs`
      <UpdateParameter @parameter={{this.obj}} @path={{this.path}} />
    `);

    await click('button');

    assert.equal(this.obj.greeting1, 42);

    this.set('path', 'greeting2');
    await click('button');

    assert.equal(this.obj.greeting2, 42);
  });

  test('it works without a value', async function(assert) {
    await render(hbs`
      <span data-test-count>{{this.count}}</span>
      <Counter @onUpdate={{set this "count"}} />
    `);

    assert.equal(find('[data-test-count]').textContent.trim(), '');

    await click('button');
    await click('button');

    assert.equal(find('[data-test-count]').textContent.trim(), '2');
  });

  test('it works without a value on an object', async function(assert) {
    this.set('user', User.create({ name: 'Alice' }));
    await render(hbs`
      <span data-test-name>{{this.user.name}}</span>
      <Parent @user={{this.user}} />
    `);

    assert.dom('[data-test-name]').hasText('Alice');

    await click('button');

    assert.dom('[data-test-name]').hasText('Bob');
  });

  test('can pick a value using {{pick}} from ember-composable-helpers', async function(assert) {
    await render(hbs`
      <span data-test-greeting>{{this.greeting}}</span>

      <input {{on "input" (pick "target.value" (set this "greeting"))}}>
    `);

    assert.equal(find('[data-test-greeting]').textContent.trim(), '');

    await fillIn('input', 'Hello!');

    assert.equal(find('[data-test-greeting]').textContent.trim(), 'Hello!');
  });
});