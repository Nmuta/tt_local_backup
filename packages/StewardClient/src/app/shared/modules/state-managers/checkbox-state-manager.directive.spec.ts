import { CheckboxStateManagerDirective } from './checkbox-state-manager.directive';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'CheckboxStateManagerDirective', () => {
  it('should create an instance', () => {
    const directive = new CheckboxStateManagerDirective(null, []);
    expect(directive).toBeTruthy();
  });
});
