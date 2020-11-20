import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // describe('If profile is invalid', () => {
  //   beforeEach(() => {
  //     guard.profile$ = of(null);
  //   });

  //   it('Should call router.navigate correctly', () => {
  //     expect(mockRouter.navigate).toHaveBeenCalledWith([`/auth`], {
  //       queryParams: { from: 'ticket-sidebar' },
  //     });
  //   });
  // });

  // describe('If subscribing to profile times out', () => {
  //   const delayTime = 20000;
  //   beforeEach(() => {
  //     mockRouter.navigate = jasmine.createSpy('navigate');
  //     Object.defineProperty(component, 'profile$', { writable: true });
  //     component.profile$ = of(testProfile).pipe(delay(delayTime));
  //   });

  //   it('Should set loading to false', fakeAsync(() => {
  //     component.ngOnInit();
  //     tick(delayTime);
  //     expect(component.loading).toBeFalsy();
  //   }));

  //   it('Should call router.navigate correctly', fakeAsync(() => {
  //     component.ngOnInit();
  //     tick(delayTime);
  //     expect(mockRouter.navigate).toHaveBeenCalledWith([`/auth`], {
  //       queryParams: { from: 'ticket-sidebar' },
  //     });
  //   }));
  // });

      // describe('If profile is invalid', () => {
      //   beforeEach(() => {
      //     component.profile$ = of(null);
      //   });

      //   it('Should call router.navigate correctly', () => {
      //     component.ngOnInit();
      //     expect(mockRouter.navigate).toHaveBeenCalledWith([`/auth`], {
      //       queryParams: { from: 'navbar-app' },
      //     });
      //   });
      // });
});
