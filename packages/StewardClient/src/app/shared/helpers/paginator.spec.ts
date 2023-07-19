import { waitForAsync } from '@angular/core/testing';
import { clone } from 'lodash';
import { Subject } from 'rxjs';
import { ignorePaginatorQueryParams, PaginatorQueryParams } from './paginator';

describe('Helper: paginator', () => {
  describe('Method: ignorePaginatorQueryParams', () => {
    const queryParams1 = {
      foo: 'bar',
      cat: 'dog',
      [PaginatorQueryParams.Index]: 0,
      [PaginatorQueryParams.Size]: 25,
    };

    const queryParams2 = clone(queryParams1);
    queryParams2.ps = 10;

    const queryParams3 = clone(queryParams1);
    queryParams3.foo = 'boo';
    queryParams3.cat = 'frog';

    let testOutput = {};
    const testSubject = new Subject<unknown>();
    const testSubscribe = testSubject.pipe(ignorePaginatorQueryParams()).subscribe(event => {
      testOutput = event;
    });

    afterAll(() => {
      testSubscribe.unsubscribe();
    });

    it('should always let the first event through', waitForAsync(() => {
      testSubject.next(queryParams1);

      expect(testOutput).toEqual(queryParams1);
    }));

    describe('When provided event query params match previous params except for paginator-specific keys', () => {
      it('should not let event through', waitForAsync(() => {
        testSubject.next(queryParams2);

        expect(testOutput).toEqual(queryParams1);
      }));
    });

    describe('When provided event query params do not match previous params', () => {
      it('should let event through', waitForAsync(() => {
        testSubject.next(queryParams3);

        expect(testOutput).toEqual(queryParams3);
      }));
    });
  });
});
