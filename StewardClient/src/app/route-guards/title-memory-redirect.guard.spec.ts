import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { TitleMemoryState } from '@shared/state/title-memory/title-memory.state';

import { TitleMemoryRedirectGuard } from './title-memory-redirect.guard';

describe('TitleMemoryRedirectGuard', () => {
  let guard: TitleMemoryRedirectGuard;
  let store: Store;
  const testRouteParentParent: Partial<ActivatedRouteSnapshot> = { data: { tool: 'gifting' }};
  const testRouteParent: Partial<ActivatedRouteSnapshot> = { parent: testRouteParentParent as unknown as ActivatedRouteSnapshot };
  const testRoute: Partial<ActivatedRouteSnapshot> = { parent: testRouteParent as unknown as ActivatedRouteSnapshot};
  const testSnapshot: Partial<RouterStateSnapshot> = { };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), NgxsModule.forRoot([TitleMemoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    guard = TestBed.inject(TitleMemoryRedirectGuard);
    store = TestBed.inject(Store);

    store.dispatch = jasmine.createSpy('dispatch');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should emit UpdateTitleMemory', (done) => {
    guard.canActivate(testRoute as ActivatedRouteSnapshot, testSnapshot as RouterStateSnapshot).subscribe(result => {
      expect(result instanceof UrlTree).toBeTruthy();
      expect(result).toBeTruthy();
      done();
    });
  });
});
