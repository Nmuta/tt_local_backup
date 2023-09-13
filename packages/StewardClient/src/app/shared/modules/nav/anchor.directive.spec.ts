import { AnchorDirective } from './anchor.directive';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('AnchorDirective', () => {
  it('should create an instance', () => {
    const directive = new AnchorDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
