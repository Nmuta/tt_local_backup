import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AuthGuard } from './auth.guard';

describe('AuthGuard:', () => {
  let guard: AuthGuard;
  let store: Store;
  const testProfile: UserModel = { emailAddress: 'test.email@microsoft.com' };
  const testRoute: Partial<ActivatedRouteSnapshot> = {};
  const testSnapshot: Partial<RouterStateSnapshot> = { url: '/i/am/a/route?with=query' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    });
    guard = TestBed.inject(AuthGuard);
    store = TestBed.inject(Store);

    store.dispatch = jasmine.createSpy('dispatch');
    Object.defineProperty(guard, 'profile$', { writable: true });

    guard.profile$ = of(testProfile);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow passage', () => {
    const action = guard.canActivate(testRoute as never, testSnapshot as never);
    action.subscribe(result => expect(result).toBeTruthy());
  });

  describe('when profile is invalid:', () => {
    beforeEach(() => {
      guard.profile$ = of(null);
    });

    it('should call router.navigate correctly', fakeAsync(() => {
      const action = guard.canActivate(testRoute as never, testSnapshot as never);
      action.subscribe(result => expect(result).toBeFalsy());

      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new Navigate(['/auth/login'], { from: '/i/am/a/route' }),
      );
    }));
  });

  describe('when profile times out:', () => {
    const delayTime = 20_000;

    beforeEach(() => {
      guard.profile$ = of(testProfile).pipe(delay(delayTime));
    });

    it('Should call router.navigate correctly', fakeAsync(() => {
      const action = guard.canActivate(testRoute as never, testSnapshot as never);
      action.subscribe(result => expect(result).toBeFalsy());
      tick(delayTime);

      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        new Navigate(['/auth/login'], { from: '/i/am/a/route' }),
      );
    }));
  });
});
