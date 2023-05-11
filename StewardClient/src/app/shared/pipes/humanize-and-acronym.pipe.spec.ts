import { HumanizeAndAcronymPipe } from './humanize-and-acronym.pipe';

describe('HumanizeAndAcronymPipe', () => {
  it('create an instance', () => {
    const pipe = new HumanizeAndAcronymPipe();
    expect(pipe).toBeTruthy();
  });

  it('handles CamelCase', () => {
    const pipe = new HumanizeAndAcronymPipe();
    expect(pipe.transform('CamelCase')).toBe('Camel Case');
  });

  it('handles camelCase', () => {
    const pipe = new HumanizeAndAcronymPipe();
    expect(pipe.transform('camelCase')).toBe('Camel Case');
  });

  it('handles Checksum_ObfuscatedDataAccessors', () => {
    const pipe = new HumanizeAndAcronymPipe();
    expect(pipe.transform('Checksum_ObfuscatedDataAccessors')).toBe(
      'Checksum - Obfuscated Data Accessors',
    );
  });

  it('handles UWP', () => {
    const pipe = new HumanizeAndAcronymPipe();
    expect(pipe.transform('UWP')).toBe('UWP');
  });

  it('handles acronyms', () => {
    const pipe = new HumanizeAndAcronymPipe();
    expect(pipe.transform('ugc')).toBe('UGC');
    expect(pipe.transform('vin')).toBe('VIN');
    expect(pipe.transform('id')).toBe('ID');
  });

  it('passes through non-strings', () => {
    const pipe = new HumanizeAndAcronymPipe();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(pipe.transform(8675309 as any)).toBe(8675309 as any);
  });
});
