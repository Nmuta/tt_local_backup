import { DeviceType } from '@models/enums';
import { DomainEnumPrettyPrintPipe } from './domain-enum-pretty-print.pipe';

describe('DomainEnumPrettyPrintPipe', () => {
  it('create an instance', () => {
    const pipe = new DomainEnumPrettyPrintPipe();
    expect(pipe).toBeTruthy();
  });

  it('handles CamelCase', () => {
    const pipe = new DomainEnumPrettyPrintPipe();
    expect(pipe.transform(DeviceType.XboxSeriesXS)).toBe('Xbox Series X|S');
  });

  it('handles CamelCase', () => {
    const pipe = new DomainEnumPrettyPrintPipe();
    expect(pipe.transform(DeviceType.XboxCloud)).toBe('XCloud');
  });

  it('handles camelCase', () => {
    const pipe = new DomainEnumPrettyPrintPipe();
    expect(pipe.transform('camelCase')).toBe('camelCase');
  });
});
