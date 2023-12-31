import { HttpParams } from '@angular/common/http';
import faker from '@faker-js/faker';
import { addQueryParamArray } from './query-param-helpers';

describe('Helper: add-query-param-array', () => {
  describe('Method: addQueryParamArray', () => {
    const params = new HttpParams().set('foo', 'bar');
    const paramName = faker.random.word();
    const paramsValues = [faker.random.word(), faker.random.word(), faker.random.word()];

    it('should correctly add params to the existing HttpParams object', () => {
      const response = addQueryParamArray(params, paramName, paramsValues);

      expect(response.has('foo')).toBeTruthy();
      const returnedArray = response.getAll(paramName);
      expect(returnedArray[0]).toEqual(paramsValues[0]);
      expect(returnedArray[1]).toEqual(paramsValues[1]);
      expect(returnedArray[2]).toEqual(paramsValues[2]);
    });
  });
});
