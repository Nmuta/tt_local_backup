import { MonitorCheckboxDirective } from './monitor-checkbox.directive';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('MonitorCheckboxDirective', () => {
  it('should create an instance', () => {
    const directive = new MonitorCheckboxDirective();
    expect(directive).toBeTruthy();
  });
});
