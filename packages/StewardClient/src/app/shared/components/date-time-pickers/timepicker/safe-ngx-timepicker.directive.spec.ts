import { SafeNgxTimepickerDirective } from './safe-ngx-timepicker.directive';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SafeNgxTimepickerDirective', () => {
  it('should create an instance', () => {
    const directive = new SafeNgxTimepickerDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
