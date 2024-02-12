# Changelog

## Release (2024-02-12)

ember-set-helper 3.0.1 (patch)

#### :bug: Bug Fix
* `ember-set-helper`, `test-app`
  * [#67](https://github.com/adopted-ember-addons/ember-set-helper/pull/67) Ensure workspace root is a private unnamed package ([@gilest](https://github.com/gilest))

#### :house: Internal
* `ember-set-helper`, `test-app`
  * [#64](https://github.com/adopted-ember-addons/ember-set-helper/pull/64) Move ci.yml to correct folder ([@MelSumner](https://github.com/MelSumner))
* Other
  * [#65](https://github.com/adopted-ember-addons/ember-set-helper/pull/65) putting it back where it was first ([@MelSumner](https://github.com/MelSumner))

#### Committers: 2
- Giles Thompson ([@gilest](https://github.com/gilest))
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))

## Release (2024-02-08)

ember-set-helper 3.0.0 (major)

#### :boom: Breaking Change
* `ember-set-helper`, `test-app`
  * [#51](https://github.com/adopted-ember-addons/ember-set-helper/pull/51) Convert to v2 addon, plain function with types ([@johanrd](https://github.com/johanrd))

#### :bug: Bug Fix
* `ember-set-helper`
  * [#55](https://github.com/adopted-ember-addons/ember-set-helper/pull/55) Add template-registry.ts ([@johanrd](https://github.com/johanrd))

#### :house: Internal
* Other
  * [#61](https://github.com/adopted-ember-addons/ember-set-helper/pull/61) moving to release-plan ([@MelSumner](https://github.com/MelSumner))
  * [#54](https://github.com/adopted-ember-addons/ember-set-helper/pull/54) Create dependabot.yml ([@MelSumner](https://github.com/MelSumner))
* `test-app`
  * [#53](https://github.com/adopted-ember-addons/ember-set-helper/pull/53) Add a little CI ([@MelSumner](https://github.com/MelSumner))

#### Committers: 2
- Melanie Sumner ([@MelSumner](https://github.com/MelSumner))
- [@johanrd](https://github.com/johanrd)

## v2.0.1 (2021-05-03)

#### :bug: Bug Fix
* [#33](https://github.com/pzuraq/ember-set-helper/pull/33) Update assertion to match README ([@betocantu93](https://github.com/betocantu93))
* [#32](https://github.com/pzuraq/ember-set-helper/pull/32) Move htmlbars to dev dep ([@nlfurniss](https://github.com/nlfurniss))

#### Committers: 2
- Alberto Cantú Gómez ([@betocantu93](https://github.com/betocantu93))
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))

## v2.0.0 (2020-10-27)

#### :boom: Breaking Change
* [#28](https://github.com/pzuraq/ember-set-helper/pull/28) [REFACTOR] Remove template transform ([@pzuraq](https://github.com/pzuraq))

#### Committers: 1
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))


## v1.1.0 (2020-08-31)

#### :rocket: Enhancement
* [#26](https://github.com/pzuraq/ember-set-helper/pull/26) Remove target from assertion to better align with `mut` ([@rwwagner90](https://github.com/rwwagner90))

#### Committers: 1
- Robert Wagner ([@rwwagner90](https://github.com/rwwagner90))


## v1.0.1 (2020-07-17)

#### :bug: Bug Fix
* [#22](https://github.com/pzuraq/ember-set-helper/pull/22) Fix setting a component argument's value ([@boris-petrov](https://github.com/boris-petrov))

#### Committers: 3
- Boris Petrov ([@boris-petrov](https://github.com/boris-petrov))
- Jonathan ([@lljr](https://github.com/lljr))
- Robert Wagner ([@rwwagner90](https://github.com/rwwagner90))


## v1.0.0 (2020-07-11)

Placeholder syntax has been removed in this major release. It was experimental,
and the finding was that it couldn't be generalized in a way that would make
sense in the Handlebars language. Removing it brings this addon more inline with
the future of the language as a whole.

The API has been simplified, and documentation has been updated to reflect the
new API without placeholder syntax.

#### :boom: Breaking Change
* [#20](https://github.com/pzuraq/ember-set-helper/pull/20) [FEAT] Refactor and Simplify ([@pzuraq](https://github.com/pzuraq))

#### Committers: 3
- Andrey Fel ([@andreyfel](https://github.com/andreyfel))
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- Julien Palmas ([@bartocc](https://github.com/bartocc))


