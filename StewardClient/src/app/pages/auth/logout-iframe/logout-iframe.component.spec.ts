import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { delay, startWith } from 'rxjs/operators';
import faker from 'faker';

import { LogoutIframeComponent } from './logout-iframe.component';

describe('LogoutIframeComponent:', () => {
  let component: LogoutIframeComponent;
  let fixture: ComponentFixture<LogoutIframeComponent>;
  let store: Store;
  const testProfile: UserModel = {
    emailAddress: 'test.email@microsoft.com',
    role: UserRole.LiveOpsAdmin,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [LogoutIframeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    store.dispatch = jasmine.createSpy('dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutIframeComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'profile$', { writable: true });
    component.profile$ = of();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('has profile:', () => {
    beforeEach(() => {
      component.profile$ = of(testProfile);
    });

    it('should not redirect', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledTimes(0);
    });
  });

  describe('null profile:', () => {
    beforeEach(() => {
      component.profile$ = of(null);
    });

    it('should redirect', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledWith(new Navigate(['/auth/aad-logout']));
    });
  });

  describe('delayed null profile:', () => {
    const delayToProfile = 3_000;
    beforeEach(() => {
      component.profile$ = of(null).pipe(delay(delayToProfile), startWith(testProfile));
    });

    it('should redirect', fakeAsync(() => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledTimes(0);
      tick(delayToProfile + 1_000);
      expect(store.dispatch).toHaveBeenCalledWith(new Navigate(['/auth/aad-logout']));
    }));
  });
});
