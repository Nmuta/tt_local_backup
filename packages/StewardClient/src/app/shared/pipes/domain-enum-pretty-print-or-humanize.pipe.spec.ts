import { DomainEnumPrettyPrintOrHumanizePipe } from './domain-enum-pretty-print-or-humanize.pipe';

describe('DomainEnumPrettyPrintOrHumanizePipe', () => {
  it('create an instance', () => {
    const pipe = new DomainEnumPrettyPrintOrHumanizePipe();
    expect(pipe).toBeTruthy();
  });

  it('handles CamelCase', () => {
    const pipe = new DomainEnumPrettyPrintOrHumanizePipe();
    expect(pipe.transform('XboxSeriesXS')).toBe('Xbox Series X|S');
  });

  it('handles camelCase', () => {
    const pipe = new DomainEnumPrettyPrintOrHumanizePipe();
    expect(pipe.transform('camelCase')).toBe('Camel Case');
  });
});
