import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click, fillIn } from '@ember/test-helpers';
import { tracked } from 'tracked-built-ins';
import hbs from 'htmlbars-inline-precompile';
import User from 'test-app/models/user';

module('Integration | Helper | set', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    const data = new (class {
      @tracked greeting;
    })();
    this.data = data;

    await render(hbs`
      <span data-test-greeting>{{this.data.greeting}}</span>

      <button type="button" {{on "click" (set this.data "greeting" "Hello!")}}>
        English
      </button>
    `);

    assert.strictEqual(find('[data-test-greeting]').textContent.trim(), '');

    await click('button');

    assert.strictEqual(
      find('[data-test-greeting]').textContent.trim(),
      'Hello!',
    );
  });

  test('it works on local paths', async function (assert) {
    const data = new (class {
      person = tracked({});
    })();
    this.data = data;

    await render(hbs`
      <span data-test-greeting>{{this.data.person.name}}</span>

      {{#let this.data.person as |person|}}
        <button type="button" {{on "click" (set person "name" "Liz")}}>
          Set Name
        </button>
      {{/let}}
    `);

    assert.strictEqual(find('[data-test-greeting]').textContent.trim(), '');

    await click('button');

    assert.strictEqual(find('[data-test-greeting]').textContent.trim(), 'Liz');
  });

  test('it works with a dynamic path', async function (assert) {
    const data = new (class {
      @tracked path = 'greeting1';
      @tracked greeting1;
      @tracked greeting2;
    })();
    this.data = data;

    await render(hbs`
      <span data-test-greeting1>{{this.data.greeting1}}</span>
      <span data-test-greeting2>{{this.data.greeting2}}</span>

      <button type="button" {{on "click" (set this.data this.data.path "Hello!")}}>
        Set Greeting
      </button>
    `);

    assert.strictEqual(find('[data-test-greeting1]').textContent.trim(), '');
    assert.strictEqual(find('[data-test-greeting2]').textContent.trim(), '');

    await click('button');
    assert.strictEqual(
      find('[data-test-greeting1]').textContent.trim(),
      'Hello!',
    );

    data.path = 'greeting2';
    await click('button');

    assert.strictEqual(
      find('[data-test-greeting2]').textContent.trim(),
      'Hello!',
    );
  });

  test('it works with a dynamic path on a nested object', async function (assert) {
    const data = new (class {
      @tracked path = 'greeting1';
      obj = tracked({});
    })();
    this.data = data;

    await render(hbs`
      <span data-test-greeting1>{{this.data.obj.greeting1}}</span>
      <span data-test-greeting2>{{this.data.obj.greeting2}}</span>

      <button type="button" {{on "click" (set this.data (concat "obj." this.data.path) "Hello!")}}>
        Set Greeting
      </button>
    `);

    assert.strictEqual(find('[data-test-greeting1]').textContent.trim(), '');
    assert.strictEqual(find('[data-test-greeting2]').textContent.trim(), '');

    await click('button');

    assert.strictEqual(
      find('[data-test-greeting1]').textContent.trim(),
      'Hello!',
    );

    data.path = 'greeting2';
    await click('button');

    assert.strictEqual(
      find('[data-test-greeting2]').textContent.trim(),
      'Hello!',
    );
  });

  test('it works with a dynamic path on a component argument', async function (assert) {
    const data = new (class {
      @tracked path = 'greeting1';
      @tracked obj = {};
    })();
    this.data = data;

    await render(hbs`
      <UpdateParameter @parameter={{this.data.obj}} @path={{this.data.path}} />
    `);

    await click('button');

    assert.strictEqual(data.obj.greeting1, 42);

    data.path = 'greeting2';
    await click('button');

    assert.strictEqual(data.obj.greeting2, 42);
  });

  test('it works without a value on an object', async function (assert) {
    const data = new (class {
      user = tracked(User.create({ name: 'Alice' }));
    })();
    this.data = data;

    await render(hbs`
      <span data-test-name>{{this.data.user.name}}</span>
      <Parent @user={{this.data.user}} />
    `);

    assert.dom('[data-test-name]').hasText('Alice');

    await click('button');

    assert.dom('[data-test-name]').hasText('Bob');
  });

  test('can pick a value using {{pick}} from ember-composable-helpers', async function (assert) {
    const data = new (class {
      @tracked greeting;
    })();
    this.data = data;

    await render(hbs`
      <span data-test-greeting>{{this.data.greeting}}</span>

      <label for="greeting-input">Greeting:</label>
      <input id="greeting-input" {{on "input" (pick "target.value" (set this.data "greeting"))}}>
    `);

    assert.strictEqual(find('[data-test-greeting]').textContent.trim(), '');

    await fillIn('#greeting-input', 'Hello!');

    assert.strictEqual(
      find('[data-test-greeting]').textContent.trim(),
      'Hello!',
    );
  });
});
