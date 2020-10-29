import { HumanizePipe } from './humanize.pipe';

describe('HumanizePipe', () => {
  it('create an instance', () => {
    const pipe = new HumanizePipe();
    expect(pipe).toBeTruthy();
  });

  it('handles CamelCase', () => {
    const pipe = new HumanizePipe();
    expect(pipe.transform("CamelCase")).toBe("Camel Case");
  });

  it('handles camelCase', () => {
    const pipe = new HumanizePipe();
    expect(pipe.transform("camelCase")).toBe("Camel Case");
  });

  it('handles Checksum_ObfuscatedDataAccessors', () => {
    const pipe = new HumanizePipe();
    expect(pipe.transform("Checksum_ObfuscatedDataAccessors")).toBe("Checksum - Obfuscated Data Accessors");
  });

  it('handles UWP', () => {
    const pipe = new HumanizePipe();
    expect(pipe.transform("UWP")).toBe("UWP");
  });
});
