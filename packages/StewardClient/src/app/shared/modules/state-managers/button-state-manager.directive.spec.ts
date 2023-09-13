import { ButtonStateManagerDirective } from './button-state-manager.directive';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ButtonStateManagerDirective', () => {
  it('should create an instance', () => {
    const directive = new ButtonStateManagerDirective(null, []);
    expect(directive).toBeTruthy();
  });
});
