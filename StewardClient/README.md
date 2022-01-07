# Steward UI

## StackBlitz Examples

- [Chips with multi-line pasting](https://stackblitz.com/edit/angular-v3s2yp-d4aqen?file=src%2Fapp%2Fchips-input-example.ts)
- [Autocomplete with category search](https://stackblitz.com/edit/angular-x6g9wf-3g2gjc?file=src%2Fapp%2Fautocomplete-optgroup-example.ts)

## Testing

Karma tests are horribly slow due to an issue with Angular.  
All stylesheets are re-compiled between each save, which takes a very long time.  
See https://dev.azure.com/turn10/Services/_git/Web-Steward/pullrequest/10502

To avoid this, run `test:prepare` to empty all SCSS files under `src` before testing (this replaces their contents with the contents of `empty.not-scss`).

To stage non-scss files for commit, use `test:prepare:add`.
(Commit as normal afterward, as by using `git commit -m 'message here'` or your normal method. Do not commit the emptied scss files)

Once you are done running karma tests, revert all the scss files with `test:prepare:reset`.

## Type/Jasmine versioning

We need to stick with version 3.3.0 until this issue is resolved: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42455
