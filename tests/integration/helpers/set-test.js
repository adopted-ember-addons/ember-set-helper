import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | set', function(hooks) {
  setupRenderingTest(hooks);

  test('it works', async function(assert) {
    await render(hbs`
      <span data-test-greeting>{{this.greeting}}</span>

      <button {{on "click" (set this.greeting "Hello!")}}>
        English
      </button>
    `);

    assert.equal(find('[data-test-greeting]').textContent.trim(), '');

    await click('button');

    assert.equal(find('[data-test-greeting]').textContent.trim(), 'Hello!');
  });

  test('it works object-key syntax', async function(assert) {
    await render(hbs`
      <span data-test-greeting>{{this.greeting}}</span>

      <button {{on "click" (set this "greeting" "Hello!")}}>
        English
      </button>
    `);

    assert.equal(find('[data-test-greeting]').textContent.trim(), '');

    await click('button');

    assert.equal(find('[data-test-greeting]').textContent.trim(), 'Hello!');
  });

  test('it works with placeholders', async function(assert) {
    await render(hbs`
      <span data-test-count>{{this.count}}</span>
      <Counter @onUpdate={{set this.count _}} />
    `);

    assert.equal(find('[data-test-count]').textContent.trim(), '');

    await click('button');
    await click('button');

    assert.equal(find('[data-test-count]').textContent.trim(), '2');
  });

  test('placeholders work with (get)', async function(assert) {
    await render(hbs`
      <span data-test-greeting>{{this.greeting}}</span>

      <button
        value="Hola!"
        {{on "click" (set this.greeting (get _ "target.value"))}}
      >
        Español
      </button>
    `);

    assert.equal(find('[data-test-greeting]').textContent.trim(), '');

    await click('button');

    assert.equal(find('[data-test-greeting]').textContent.trim(), 'Hola!');
  });

  test('set helper works with argument', async function(assert) {
    this.set('greeting', { hi: 'Hi!' });

    this.owner.register('template:components/greeting', hbs`
      <button
        value="Hola!"
        {{on "click" (set @greeting.hi (get _ "target.value"))}}
      >
        Español
      </button>
    `);
    await render(hbs`<Greeting @greeting={{this.greeting}}/>`);

    await click('button');
    assert.equal(this.greeting.hi, 'Hola!');
  });
});
