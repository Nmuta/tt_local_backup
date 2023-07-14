import { Duration } from 'luxon';
import { DurationToMillisPipe } from './duration-to-millis.pipe';

describe('DurationToMillisPipe', () => {
  it('create an instance', () => {
    const pipe = new DurationToMillisPipe();
    expect(pipe).toBeTruthy();
  });

  it('should convert correctly', () => {
    const pipe = new DurationToMillisPipe();
    const oneMinute = Duration.fromMillis(60_000);
    expect(pipe.transform(oneMinute)).toBe(60_000);
  });
});
