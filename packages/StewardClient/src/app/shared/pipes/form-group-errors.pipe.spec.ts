import { FormGroupErrorsPipe } from './form-group-errors.pipe';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'FormGroupErrorsPipe', () => {
  it('create an instance', () => {
    const pipe = new FormGroupErrorsPipe();
    expect(pipe).toBeTruthy();
  });
});
