import { RenderGuardSyncPipe } from './render-guard-sync.pipe';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'RenderGuardSyncPipe', () => {
  it('create an instance', () => {
    const pipe = new RenderGuardSyncPipe(null);
    expect(pipe).toBeTruthy();
  });
});
