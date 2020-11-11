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
    "root": true,
    "overrides": [
      /**
       * -----------------------------------------------------
       * TYPESCRIPT FILES (COMPONENTS, SERVICES ETC) (.ts)
       * -----------------------------------------------------
       */
      {
        "files": ["*.ts"],
        "parserOptions": {
          "project": [
            "tsconfig.*?.json",
            // "e2e/tsconfig.json" // we deleted this
          ],
          "createDefaultProgram": true
        },
        "extends": [
          "plugin:@angular-eslint/recommended",
          'plugin:@typescript-eslint/recommended',
        ],
        "rules": {
          /**
           * Any TypeScript related rules you wish to use/reconfigure over and above the
           * recommended set provided by the @angular-eslint project would go here.
           *
           * There are some examples below from the @angular-eslint plugin and ESLint core:
           */
          "@typescript-eslint/no-inferrable-types": "off", // why? over-specification of inferrable types is a style choice
          "max-len": "off", // why? prettier may go above or below the target max length. just let it do its thing
          "@angular-eslint/directive-selector": [
            "error",
            { "type": "attribute", "prefix": "app", "style": "camelCase" }
          ],
          "@angular-eslint/component-selector": [
            "error",
            { "type": "element", "prefix": "app", "style": "kebab-case" }
          ],
          "quotes": ["error", "single", { "allowTemplateLiterals": true }],
          "@typescript-eslint/ban-types": "warn",
          "@angular-eslint/component-selector": "off", // TODO: discuss
          "@typescript-eslint/member-ordering": "off", // TODO: this should be turned on and configured
        }
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
        "files": ["*.component.html"],
        "extends": ["plugin:@angular-eslint/template/recommended"],
        "rules": {
          /**
           * Any template/HTML related rules you wish to use/reconfigure over and above the
           * recommended set provided by the @angular-eslint project would go here.
           *
           * There is an example below from ESLint core (note, this specific example is not
           * necessarily recommended for all projects):
           */
          "max-len": ["error", { "code": 140 }]
        }
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
        "files": ["*.component.ts"],
        "extends": ["plugin:@angular-eslint/template/process-inline-templates"]
      }
    ]
  }
  