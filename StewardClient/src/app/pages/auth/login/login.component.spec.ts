import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { RecheckAuth } from '@shared/state/user/user.actions';
import { of } from 'rxjs';
import { delay, startWith } from 'rxjs/operators';
import faker from 'faker';

import { LoginComponent } from './login.component';
import { createMockWindowService, WindowService } from '@services/window';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let activatedRoute: ActivatedRoute;
  let store: Store;
  let mockWindowService: WindowService;

  const sampleRoute = '/i/am/a/route';
  const testProfile: UserModel = {
    emailAddress: 'test.email@microsoft.com',
    role: UserRole.LiveOpsAdmin,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    objectId: `${faker.datatype.uuid()}`,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), RouterTestingModule.withRoutes([])],
      declarations: [LoginComponent],
      providers: [
        ...createMockMsalServices(),
        createMockLoggerService(),
        createMockWindowService(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    mockWindowService = TestBed.inject(WindowService);

    store.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
    activatedRoute = TestBed.inject(ActivatedRoute);
    mockWindowService.location = jasmine
      .createSpy('location')
      .and.returnValue({ origin: 'http://microsoft.test' });

    activatedRoute.snapshot = {
      queryParamMap: convertToParamMap({ from: sampleRoute }),
    } as ActivatedRouteSnapshot;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'profile$', { writable: true });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('has profile:', () => {
    beforeEach(() => {
      component.profile$ = of(testProfile);
    });

    it(
      'should redirect',
      waitForAsync(async () => {
        await fixture.whenStable();
        expect(store.dispatch).toHaveBeenCalledWith(new RecheckAuth());
        expect(store.dispatch).toHaveBeenCalledWith(new Navigate([sampleRoute]));
      }),
    );
  });

  describe('null profile:', () => {
    beforeEach(() => {
      component.profile$ = of(null);
    });

    it(
      'should error',
      waitForAsync(async () => {
        await fixture.whenStable();
        expect(store.dispatch).toHaveBeenCalledWith(new RecheckAuth());
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(component.error).toBeTruthy();
      }),
    );
  });

  describe('delayed null profile:', () => {
    const delayToProfile = 3_000;
    beforeEach(() => {
      component.profile$ = of(null).pipe(delay(delayToProfile), startWith(testProfile));
    });

    it(
      'should redirect',
      waitForAsync(async () => {
        expect(store.dispatch).toHaveBeenCalledTimes(0);
        await fixture.whenStable();
        expect(store.dispatch).toHaveBeenCalledWith(new RecheckAuth());
        expect(store.dispatch).toHaveBeenCalledWith(new Navigate([sampleRoute]));
      }),
    );
  });
});
