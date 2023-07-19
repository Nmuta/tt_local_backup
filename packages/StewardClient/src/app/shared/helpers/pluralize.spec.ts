import BigNumber from 'bignumber.js';
import { pluralize, PluralizeConfig } from './pluralize';

// prettier made this basically unreadable so i disabled it
// prettier-ignore
describe('pluralize', () => {
  const configWithNumbers: PluralizeConfig = {
    includeNumber: true,
    zero: 'zero',
    one: 'one',
    two: 'two',
    other: 'other',
  };
  const configWithoutNumbers: PluralizeConfig = {
    includeNumber: false,
    zero: 'zero',
    one: 'one',
    two: 'two',
    other: 'other',
  };
  const configWithNumbersOnlyFallback: PluralizeConfig = {
    includeNumber: true,
    other: 'other',
  };
  const configWithoutNumbersOnlyFallback: PluralizeConfig = {
    includeNumber: false,
    other: 'other',
  };

  describe('function signatures', () => {
    function tests(numberPassthru: (number) => (number | BigNumber)): void {
      describe('config signature', () => {
        it('numbers should be included correctly', () => {
          expect(pluralize(numberPassthru(0), configWithNumbers)).toEqual('0 zero');
          expect(pluralize(numberPassthru(1), configWithNumbers)).toEqual('1 one');
          expect(pluralize(numberPassthru(2), configWithNumbers)).toEqual('2 two');
          expect(pluralize(numberPassthru(3), configWithNumbers)).toEqual('3 other');
          expect(pluralize(numberPassthru(-1), configWithNumbers)).toEqual('-1 other');
  
          expect(pluralize(numberPassthru(0), configWithoutNumbers)).toEqual('zero');
          expect(pluralize(numberPassthru(1), configWithoutNumbers)).toEqual('one');
          expect(pluralize(numberPassthru(2), configWithoutNumbers)).toEqual('two');
          expect(pluralize(numberPassthru(3), configWithoutNumbers)).toEqual('other');
          expect(pluralize(numberPassthru(-1), configWithoutNumbers)).toEqual('other');
        });

        it('fallback should work correctly', () => {
          expect(pluralize(numberPassthru(0), configWithNumbersOnlyFallback)).toEqual('0 other');
          expect(pluralize(numberPassthru(1), configWithNumbersOnlyFallback)).toEqual('1 other');
          expect(pluralize(numberPassthru(2), configWithNumbersOnlyFallback)).toEqual('2 other');
          expect(pluralize(numberPassthru(3), configWithNumbersOnlyFallback)).toEqual('3 other');
          expect(pluralize(numberPassthru(-1), configWithNumbersOnlyFallback)).toEqual('-1 other');
  
          expect(pluralize(numberPassthru(0), configWithoutNumbersOnlyFallback)).toEqual('other');
          expect(pluralize(numberPassthru(1), configWithoutNumbersOnlyFallback)).toEqual('other');
          expect(pluralize(numberPassthru(2), configWithoutNumbersOnlyFallback)).toEqual('other');
          expect(pluralize(numberPassthru(3), configWithoutNumbersOnlyFallback)).toEqual('other');
          expect(pluralize(numberPassthru(-1), configWithoutNumbersOnlyFallback)).toEqual('other');
        });
      });

      describe('zero-one-two-other signature', () => {
        it ('should work when fully specified', () => {
          expect(pluralize(numberPassthru(0), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.two, configWithNumbers.other)).toEqual('zero');
          expect(pluralize(numberPassthru(1), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.two, configWithNumbers.other)).toEqual('one');
          expect(pluralize(numberPassthru(2), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.two, configWithNumbers.other)).toEqual('two');
          expect(pluralize(numberPassthru(3), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.two, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(-1), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.two, configWithNumbers.other)).toEqual('other');
        });
        it ('should work with only fallback', () => {
          expect(pluralize(numberPassthru(0), null, null, null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(1), null, null, null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(2), null, null, null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(3), null, null, null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(-1), null, null, null, configWithNumbers.other)).toEqual('other');
        });
      });

      describe('zero-one-other signature', () => {
        it ('should work when fully specified', () => {
          expect(pluralize(numberPassthru(0), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.other)).toEqual('zero');
          expect(pluralize(numberPassthru(1), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.other)).toEqual('one');
          expect(pluralize(numberPassthru(2), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(3), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(-1), configWithNumbers.zero, configWithNumbers.one, configWithNumbers.other)).toEqual('other');
        });
        it ('should work with only fallback', () => {
          expect(pluralize(numberPassthru(0), null, null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(1), null, null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(2), null, null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(3), null, null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(-1), null, null, configWithNumbers.other)).toEqual('other');
        });
      });

      describe('one-other signature', () => {
        it ('should work when fully specified', () => {
          expect(pluralize(numberPassthru(0), configWithNumbers.one, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(1), configWithNumbers.one, configWithNumbers.other)).toEqual('one');
          expect(pluralize(numberPassthru(2), configWithNumbers.one, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(3), configWithNumbers.one, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(-1), configWithNumbers.one, configWithNumbers.other)).toEqual('other');
        });
        it ('should work with only fallback', () => {
          expect(pluralize(numberPassthru(0), null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(1), null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(2), null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(3), null, configWithNumbers.other)).toEqual('other');
          expect(pluralize(numberPassthru(-1), null, configWithNumbers.other)).toEqual('other');
        });
      });
    }

    describe('with number', () => tests(n => n));
    describe('with BigNumber', () => tests(n => new BigNumber(n)));
  });
});
