import { AcronymPipe } from './acronym.pipe';

describe('AcronymPipe', () => {
  it('create an instance', () => {
    const pipe = new AcronymPipe();
    expect(pipe).toBeTruthy();
  });

  it('handles acronyms while humanizing', () => {
    const pipe = new AcronymPipe();
    expect(pipe.transform('ugc')).toBe('UGC');
    expect(pipe.transform('vin')).toBe('VIN');
    expect(pipe.transform('id')).toBe('ID');
    expect(pipe.transform('this id should be ugc and also a vin')).toBe(
      'this ID should be UGC and also a VIN',
    );
  });

  it('passes through non-strings', () => {
    const pipe = new AcronymPipe();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(pipe.transform(8675309 as any)).toBe(8675309 as any);
  });
});
