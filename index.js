'use strict';

module.exports = {
  name: require('./package').name,

  setupPreprocessorRegistry(type, registry) {
    const plugin = this._buildPlugin();

    plugin.parallelBabel = {
      requireFile: __filename,
      buildUsing: '_buildPlugin',
      params: {}
    };

    registry.add('htmlbars-ast-plugin', plugin);
  },

  _buildPlugin() {
    const SetTransform = require('./lib/set-transform');

    return {
      name: 'set-transform',
      plugin: SetTransform,
      baseDir() {
        return __dirname;
      }
    };
  }
};
