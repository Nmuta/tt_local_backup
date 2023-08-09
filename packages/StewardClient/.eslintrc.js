/**
 * -----------------------------------------------------
 * NOTES ON CONFIGURATION STRUCTURE
 * -----------------------------------------------------
 *
 * Out of the box, ESLint does not support TypeScript or HTML. Naturally those are the two
 * main file types we care about in Angular projects, so we have to do a little extra work
 * to configure ESLint exactly how we need to.
 *
 * Fortunately, ESLint gives us an "overrides" configuration option which allows us to set
 * different lint tooling (parser, plugins, rules etc) for different file types, which is
 * critical because our .ts files require a different parser and different rules to our
 * .html (and our inline Component) templates.
 */
module.exports = {
  root: true,
  overrides: [
    /**
     * -----------------------------------------------------
     * TYPESCRIPT FILES (COMPONENTS, SERVICES ETC) (.ts)
     * -----------------------------------------------------
     */
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [
          './src/tsconfig.eslint.json',
          // "e2e/tsconfig.json" // we deleted this
        ],
        createDefaultProgram: true,
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:jsdoc/recommended',
      ],
      plugins: ['jsdoc', 'rxjs'],
      rules: {
        /**
         * Any TypeScript related rules you wish to use/reconfigure over and above the
         * recommended set provided by the @angular-eslint project would go here.
         *
         * There are some examples below from the @angular-eslint plugin and ESLint core:
         */
        '@typescript-eslint/no-inferrable-types': 'off', // why? over-specification of inferrable types is a style choice
        'max-len': 'off', // why? prettier may go above or below the target max length. just let it do its thing
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: 'app', style: 'camelCase' },
        ],
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: 'app', style: 'kebab-case' },
        ],
        quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: [], style: 'kebab-case' },
        ], // why? naming convention feels repetitive (may want to flip this if we run into conflicts)
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: [], style: 'camelCase' },
        ], // why? naming convention feels repetitive (may want to flip this if we run into conflicts)
        // '@typescript-eslint/member-ordering': ['error', { default: []} ], // temporarily disabling member ordering lint rules
        '@typescript-eslint/member-ordering': [
          'error',
          {
            default: [
              // manuallly implementing Instance Sandwich
              // instance-sandwich puts, in order of precedence:
              //  * fields before constructors before methods
              //  * static fields before instance fields, but static methods after instance methods
              //  * public members before protected members before private members

              // Index signature
              'signature',

              // Fields
              'static-field',
              'decorated-field',
              'instance-field',
              'abstract-field',

              // Constructors
              'public-constructor',
              'protected-constructor',
              'private-constructor',

              // Methods
              'public-abstract-method',
              'protected-abstract-method',
              'private-abstract-method',
              'public-instance-method',
              'protected-instance-method',
              'private-instance-method',
              // these ones can go wherever
              // 'public-decorated-method',
              // 'protected-decorated-method',
              // 'private-decorated-method',

              'public-static-method',
              'protected-static-method',
              'private-static-method',
            ],
          },
        ],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // why? underscore-prefixed _variables are required-but-not-used.

        'no-debugger': ['error'], // why? debugger statements should not be left in committed code
        'no-console': ['error'], // why? console statements should not be left in committed code
        'no-sparse-arrays': 'error', // why? sparse arrays can break .routing and .module files
        'jsdoc/check-alignment': 'error', // why? automatically configured by tslint port tool
        'jsdoc/require-returns': 'off', // why? these are rarely useful, frequently inferred in TS, bulk up the code, and get out of sync with reality
        'jsdoc/require-returns-type': 'off', // why? we already know these from TS
        'jsdoc/require-param': 'off', // why? these are rarely useful, frequently inferred in TS, bulk up the code, and get out of sync with reality
        'jsdoc/require-param-type': 'off', // why? we already know these from TS
        'jsdoc/require-description': [
          'error',
          {
            contexts: ['PropertyDefinition', 'MethodDefinition', 'ClassDeclaration'],
          },
        ], // why? requires summaries to actually be filled out
        'jsdoc/require-jsdoc': [
          // why? all public/protected exported members should have documentation
          'error',
          {
            publicOnly: false,
            checkConstructors: false,
            contexts: [
              // See for more info: https://github.com/gajus/eslint-plugin-jsdoc/issues/519#issuecomment-616007752
              'MethodDefinition:not([kind="get"],[kind="set"],[accessibility="private"])',
              'PropertyDefinition > Decorator:matches([expression.callee.name="Input"],[expression.callee.name="Output"])',
            ],
            require: {
              ArrowFunctionExpression: false,
              ClassDeclaration: true,
              ClassExpression: false,
              FunctionDeclaration: false,
              FunctionExpression: false,
              MethodDefinition: false,
            },
          },
        ],
        /**
         * RXJS rules.
         * List of rules: https://yarnpkg.com/package/eslint-plugin-rxjs
         */
        'rxjs/no-unsafe-takeuntil': 'error',
      },
      settings: {
        jsdoc: {
          ignorePrivate: true, // why? allows use of @private to suppress doc rules
        },
      },
    },

    /**
     * -----------------------------------------------------
     * COMPONENT TEMPLATES
     * -----------------------------------------------------
     *
     * If you use inline templates, make sure you read the notes on the configuration
     * object after this one to understand how they relate to this configuration directly
     * below.
     */
    {
      files: ['*.component.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        /**
         * Any template/HTML related rules you wish to use/reconfigure over and above the
         * recommended set provided by the @angular-eslint project would go here.
         *
         * There is an example below from ESLint core (note, this specific example is not
         * necessarily recommended for all projects):
         */
        'max-len': ['error', { code: 140 }],
      },
    },

    /**
     * -----------------------------------------------------
     * EXTRACT INLINE TEMPLATES (from within .component.ts)
     * -----------------------------------------------------
     *
     * This extra piece of configuration is necessary to extract inline
     * templates from within Component metadata, e.g.:
     *
     * @Component({
     *  template: `<h1>Hello, World!</h1>`
     * })
     * ...
     *
     * It works by extracting the template part of the file and treating it as
     * if it were a full .html file, and it will therefore match the configuration
     * specific for *.component.html above when it comes to actual rules etc.
     *
     * NOTE: This processor will skip a lot of work when it runs if you don't use
     * inline templates in your projects currently, so there is no great benefit
     * in removing it, but you can if you want to.
     *
     * You won't specify any rules here. As noted above, the rules that are relevant
     * to inline templates are the same as the ones defined for *.component.html.
     */
    {
      files: ['*.component.ts'],
      extends: ['plugin:@angular-eslint/template/process-inline-templates'],
    },
  ],
};
