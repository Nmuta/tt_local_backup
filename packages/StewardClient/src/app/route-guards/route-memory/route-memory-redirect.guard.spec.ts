import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { RouteMemoryState } from '@shared/state/route-memory/route-memory.state';

import { RouteMemoryRedirectGuard } from './route-memory-redirect.guard';

describe('RouteMemoryRedirectGuard', () => {
  let guard: RouteMemoryRedirectGuard;
  let store: Store;
  const testRouteParentParent: Partial<ActivatedRouteSnapshot> = { data: { tool: 'ugcDetails' } };
  const testRouteParent: Partial<ActivatedRouteSnapshot> = {
    parent: testRouteParentParent as unknown as ActivatedRouteSnapshot,
  };
  const testRoute: Partial<ActivatedRouteSnapshot> = {
    parent: testRouteParent as unknown as ActivatedRouteSnapshot,
    pathFromRoot: [
      {
        url: [
          new UrlSegment('tool', {}),
          new UrlSegment('ugc-details', {}),
          new UrlSegment('woodstock', {}),
        ],
      },
    ] as unknown as ActivatedRouteSnapshot[],
  };
  const testSnapshot: Partial<RouterStateSnapshot> = { url: 'tools/ugc-details/woodstock' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), NgxsModule.forRoot([RouteMemoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    guard = TestBed.inject(RouteMemoryRedirectGuard);
    store = TestBed.inject(Store);

    store.dispatch = jasmine.createSpy('dispatch');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should emit UpdateRouteMemory', done => {
    guard
      .canActivate(testRoute as ActivatedRouteSnapshot, testSnapshot as RouterStateSnapshot)
      .subscribe(result => {
        expect(result instanceof UrlTree).toBeTruthy();
        expect(result).toBeTruthy();
        done();
      });
  });
});
