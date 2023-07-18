import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameTitleCodeName } from '@models/enums';
import { NgxsModule, Store } from '@ngxs/store';
import { UpdateTitleMemory } from '@shared/state/title-memory/title-memory.actions';
import { TitleMemoryState } from '@shared/state/title-memory/title-memory.state';

import { TitleMemorySetGuard } from './title-memory-set.guard';

describe('TitleMemorySetGuard', () => {
  let guard: TitleMemorySetGuard;
  let store: Store;
  const testRouteParentParent: Partial<ActivatedRouteSnapshot> = { data: { tool: 'gifting' } };
  const testRouteParent: Partial<ActivatedRouteSnapshot> = {
    parent: testRouteParentParent as unknown as ActivatedRouteSnapshot,
  };
  const testRoute: Partial<ActivatedRouteSnapshot> = {
    parent: testRouteParent as unknown as ActivatedRouteSnapshot,
    url: [
      new UrlSegment('tool', null),
      new UrlSegment('gifting', null),
      new UrlSegment('Woodstock', null),
    ],
  };
  const testSnapshot: Partial<RouterStateSnapshot> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), NgxsModule.forRoot([TitleMemoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    guard = TestBed.inject(TitleMemorySetGuard);
    store = TestBed.inject(Store);

    store.dispatch = jasmine.createSpy('dispatch');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should emit UpdateTitleMemory', fakeAsync(() => {
    const result = guard.canActivate(
      testRoute as ActivatedRouteSnapshot,
      testSnapshot as RouterStateSnapshot,
    );
    expect(result).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateTitleMemory('gifting', GameTitleCodeName.FH5),
    );
  }));
});
