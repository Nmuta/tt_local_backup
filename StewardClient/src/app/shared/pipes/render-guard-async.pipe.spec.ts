import { RenderGuardAsyncPipe } from './render-guard-async.pipe';

describe('RenderGuardPipe', () => {
  it('create an instance', () => {
    const pipe = new RenderGuardAsyncPipe();
    expect(pipe).toBeTruthy();
  });
});
