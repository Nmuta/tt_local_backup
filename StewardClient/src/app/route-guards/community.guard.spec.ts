import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import faker from 'faker';

import { CommunityGuard } from './community.guard';

describe('CommunityGuard:', () => {
  let guard: CommunityGuard;
  let store: Store;
  const testProfile: UserModel = {
    emailAddress: 'test.email@microsoft.com',
    role: UserRole.LiveOpsAdmin,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    objectId: `${faker.datatype.uuid()}`,
  };
  const testRoute: Partial<ActivatedRouteSnapshot> = {};
  const testSnapshot: Partial<RouterStateSnapshot> = { url: '/i/am/a/route?with=query' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    guard = TestBed.inject(CommunityGuard);
    store = TestBed.inject(Store);

    store.dispatch = jasmine.createSpy('dispatch');
    Object.defineProperty(guard, 'profile$', { writable: true });

    guard.profile$ = of(testProfile);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('When profile has a valid role: ', () => {
    describe('LiveOpsAdmin', () => {
      beforeEach(() => {
        testProfile.role = UserRole.LiveOpsAdmin;
        guard.profile$ = of(testProfile);
      });

      it('should allow passage', () => {
        const action = guard.canActivate(testRoute as never, testSnapshot as never);
        action.subscribe(result => expect(result).toBeTruthy());
      });
    });

    describe('CommunityManager', () => {
      beforeEach(() => {
        testProfile.role = UserRole.CommunityManager;
        guard.profile$ = of(testProfile);
      });

      it('should allow passage', () => {
        const action = guard.canActivate(testRoute as never, testSnapshot as never);
        action.subscribe(result => expect(result).toBeTruthy());
      });
    });
  });

  describe('When profile has an invalid role: ', () => {
    describe('DataPipelineAdmin', () => {
      beforeEach(() => {
        testProfile.role = UserRole.DataPipelineAdmin;
        guard.profile$ = of(testProfile);
      });

      it('should call router.navigate correctly', fakeAsync(() => {
        const action = guard.canActivate(testRoute as never, testSnapshot as never);
        action.subscribe(result => expect(result).toBeFalsy());

        expect(store.dispatch).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(
          new Navigate(['/unauthorized'], { app: 'Community Manager' }),
        );
      }));
    });
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
