import { RenderGuardAsyncPipe } from './render-guard-async.pipe';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('RenderGuardPipe', () => {
  it('create an instance', () => {
    const pipe = new RenderGuardAsyncPipe();
    expect(pipe).toBeTruthy();
  });
});
