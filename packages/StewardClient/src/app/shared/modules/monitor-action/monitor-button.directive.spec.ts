import { MonitorButtonDirective } from './monitor-button.directive';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('MonitorButtonDirective', () => {
  it('should create an instance', () => {
    const directive = new MonitorButtonDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
