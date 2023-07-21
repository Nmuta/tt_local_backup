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
        // project: [
        //   './tsconfig.eslint.json',
        // ],
        createDefaultProgram: true,
      },
      extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:jsdoc/recommended'],
      plugins: ['jsdoc'],
      rules: {
        /**
         * Any TypeScript related rules you wish to use/reconfigure over and above the
         * recommended set provided by the @angular-eslint project would go here.
         *
         * There are some examples below from the @angular-eslint plugin and ESLint core:
         */
        '@typescript-eslint/no-inferrable-types': 'off', // why? over-specification of inferrable types is a style choice
        'max-len': 'off', // why? prettier may go above or below the target max length. just let it do its thing
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
        // removed because this rule does not exist
        // 'jsdoc/newline-after-description': 'error', // why? automatically configured by tslint port tool
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
      },
      settings: {
        jsdoc: {
          ignorePrivate: true, // why? allows use of @private to suppress doc rules
        },
      },
    },
  ],
};
