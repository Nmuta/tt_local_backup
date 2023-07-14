import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { UpdateRouteMemory } from '@shared/state/route-memory/route-memory.actions';
import { RouteMemoryState } from '@shared/state/route-memory/route-memory.state';

import { RouteMemorySetGuard } from './route-memory-set.guard';

describe('RouteMemorySetGuard', () => {
  let guard: RouteMemorySetGuard;
  let store: Store;
  const testRouteParentParent: Partial<ActivatedRouteSnapshot> = { data: { tool: 'ugcDetails' } };
  const testRouteParent: Partial<ActivatedRouteSnapshot> = {
    parent: testRouteParentParent as unknown as ActivatedRouteSnapshot,
  };
  const testRoute: Partial<ActivatedRouteSnapshot> = {
    parent: testRouteParent as unknown as ActivatedRouteSnapshot,
    url: [
      new UrlSegment('tool', null),
      new UrlSegment('ugc-details', null),
      new UrlSegment('woodstock', null),
    ],
  };
  const testSnapshot: Partial<RouterStateSnapshot> = { url: 'tools/ugc-details/woodstock' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), NgxsModule.forRoot([RouteMemoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    guard = TestBed.inject(RouteMemorySetGuard);
    store = TestBed.inject(Store);

    store.dispatch = jasmine.createSpy('dispatch');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should emit UpdateRouteMemory', fakeAsync(() => {
    const result = guard.canActivate(
      testRoute as ActivatedRouteSnapshot,
      testSnapshot as RouterStateSnapshot,
    );
    expect(result).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateRouteMemory('ugcDetails', 'woodstock'));
  }));
});
