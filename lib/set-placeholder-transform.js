/* eslint-env node */
'use strict';

/*
  ```hbs
  {{set this.bar _}}
  {{set this.bar.baz (get _ "qux")}}
  ```

  becomes

  ```hbs
  {{set this "bar" (-set-placeholder)}}
  {{set this.bar "baz" (get (-set-placeholder) "qux")}}
  ```
*/

module.exports = class SetPlaceholderTransform {
  transform(ast) {
    let b = this.syntax.builders;

    function recursivelyReplacePlaceholders(expr) {
      expr.params = expr.params.map(node => {
        if (node.type === 'PathExpression' && node.original === '_') {
          return b.sexpr('-set-placeholder');
        }

        if (node.type === 'SubExpression') {
          return recursivelyReplacePlaceholders(node);
        }

        return node;
      });

      return expr;
    }

    function transformNode(node) {
      if (node.path.original === 'set') {
        recursivelyReplacePlaceholders(node);

        let path = node.params[0];

        if (!node.params[0] || node.params[0].type !== 'PathExpression') {
          throw new Error(
            'the (set) helper requires a path to be passed in as its first parameter, received: ' +
              path.original
          );
        }

        if (node.params.length === 2) {
          let path = node.params.shift();

          let key = path.parts.pop();

          let splitPoint = path.original.lastIndexOf('.');
          if (splitPoint === -1) {
            // Implicit this
            path.original = 'this';
            path.parts = ['this'];
          } else {
            path.original = path.original.substr(0, splitPoint);
          }

          node.params.unshift(path, b.string(key));
        }
      }
    }

    this.syntax.traverse(ast, {
      SubExpression: transformNode,
      MustacheStatement: transformNode,
    });

    return ast;
  }
};
