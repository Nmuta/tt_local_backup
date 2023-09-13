import { MatBadgeIconDirective } from './mat-badge-icon.directive';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('MatBadgeIconDirective', () => {
  it('should create an instance', () => {
    const directive = new MatBadgeIconDirective(null);
    expect(directive).toBeTruthy();
  });
});
