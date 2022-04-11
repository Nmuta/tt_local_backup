import { onlyTrueKey, onlyTrueKeyBy } from './only-true-key';

describe('Helper: only-true-key', () => {
  describe('Method: onlyTrueKey works properly', () => {
    it('on FTF object', () => {
      const testObject = { one: false, two: true, three: false };
      expect(onlyTrueKey(testObject, 'one')).toBeFalsy();
      expect(onlyTrueKey(testObject, 'two')).toBeTruthy();
      expect(onlyTrueKey(testObject, 'one')).toBeFalsy();
    });

    it('on TTF object', () => {
      const testObject = { one: true, two: true, three: false };
      expect(onlyTrueKey(testObject, 'one')).toBeFalsy();
      expect(onlyTrueKey(testObject, 'two')).toBeFalsy();
      expect(onlyTrueKey(testObject, 'one')).toBeFalsy();
    });

    it('on FFF object', () => {
      const testObject = { one: false, two: false, three: false };
      expect(onlyTrueKey(testObject, 'one')).toBeFalsy();
      expect(onlyTrueKey(testObject, 'two')).toBeFalsy();
      expect(onlyTrueKey(testObject, 'one')).toBeFalsy();
    });
  });

  describe('Method: onlyTrueKeyBy works properly', () => {
    it('on FTF object', () => {
      const testObject = { one: { v: false }, two: { v: true }, three: { v: false } };
      expect(onlyTrueKeyBy(testObject, 'one', e => e.v)).toBeFalsy();
      expect(onlyTrueKeyBy(testObject, 'two', e => e.v)).toBeTruthy();
      expect(onlyTrueKeyBy(testObject, 'one', e => e.v)).toBeFalsy();
    });

    it('on TTF object', () => {
      const testObject = { one: { v: true }, two: { v: true }, three: { v: false } };
      expect(onlyTrueKeyBy(testObject, 'one', e => e.v)).toBeFalsy();
      expect(onlyTrueKeyBy(testObject, 'two', e => e.v)).toBeFalsy();
      expect(onlyTrueKeyBy(testObject, 'one', e => e.v)).toBeFalsy();
    });

    it('on FFF object', () => {
      const testObject = { one: { v: false }, two: { v: false }, three: { v: false } };
      expect(onlyTrueKeyBy(testObject, 'one', e => e.v)).toBeFalsy();
      expect(onlyTrueKeyBy(testObject, 'two', e => e.v)).toBeFalsy();
      expect(onlyTrueKeyBy(testObject, 'one', e => e.v)).toBeFalsy();
    });
  });
});
