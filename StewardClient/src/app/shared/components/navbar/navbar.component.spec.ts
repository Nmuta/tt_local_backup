import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, NgxsModule } from '@ngxs/store';
import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { UserModel } from '@shared/models/user.model';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NavbarComponent } from './navbar.component';
import { createMockWindowService, WindowService } from '@services/window';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;
  let mockStore: Store;
  let mockRouter: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [NavbarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWindowService(),
        createMockMsalService(),
      ],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.get(Store);
    mockRouter = injector.get(Router);
    // mockWindowService = injector.get(WindowService);

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const testProfile: UserModel = { emailAddress: 'test.email@microsoft.com' };

    describe('When subscribing to profile returns a value', () => {
      beforeEach(() => {
        mockRouter.navigate = jasmine.createSpy('navigate');
        Object.defineProperty(component, 'profile$', { writable: true });
        component.profile$ = of(testProfile);
      });

      it('Should set profile', () => {
        component.ngOnInit();
        expect(component.profile).toEqual(testProfile);
      });

      it('Should set loading to false', () => {
        component.ngOnInit();
        expect(component.loading).toBeFalsy();
      });

      describe('If profile is invalid', () => {
        beforeEach(() => {
          component.profile$ = of(null);
        });

        it('Should call router.navigate correctly', () => {
          component.ngOnInit();
          expect(mockRouter.navigate).toHaveBeenCalledWith([`/auth`], {
            queryParams: { from: '/context.html' },
          });
        });
      });

      describe('If profile is valid', () => {
        beforeEach(() => {
          component.profile$ = of(testProfile);
        });

        it('Should not redirect to auth page', () => {
          component.ngOnInit();
          expect(mockRouter.navigate).not.toHaveBeenCalledWith([`/auth`], {
            queryParams: { from: '/context.html' },
          });
        });
      });
    });

    describe('If subscribing to profile times out', () => {
      const delayTime = 20000;
      beforeEach(() => {
        mockRouter.navigate = jasmine.createSpy('navigate');
        Object.defineProperty(component, 'profile$', { writable: true });
        component.profile$ = of(testProfile).pipe(delay(delayTime));
      });

      it('Should set loading to false', fakeAsync(() => {
        component.ngOnInit();
        tick(delayTime);
        expect(component.loading).toBeFalsy();
      }));

      it('Should call router.navigate correctly', fakeAsync(() => {
        component.ngOnInit();
        tick(delayTime);
        expect(mockRouter.navigate).toHaveBeenCalledWith([`/auth`], {
          queryParams: { from: '/context.html' },
        });
      }));
    });
  });
});
