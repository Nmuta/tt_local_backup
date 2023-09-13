import { BigJsonPipe } from './big-json.pipe';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'BigJsonPipe', () => {
  it('create an instance', () => {
    const pipe = new BigJsonPipe();
    expect(pipe).toBeTruthy();
  });

  it('handles null', () => {
    const pipe = new BigJsonPipe();
    const formatted = pipe.transform(null);
    expect(formatted).toBe('null');
  });
});
