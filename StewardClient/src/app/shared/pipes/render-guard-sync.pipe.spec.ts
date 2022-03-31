import { RenderGuardSyncPipe } from './render-guard-sync.pipe';

describe('RenderGuardSyncPipe', () => {
  it('create an instance', () => {
    const pipe = new RenderGuardSyncPipe(null);
    expect(pipe).toBeTruthy();
  });
});
