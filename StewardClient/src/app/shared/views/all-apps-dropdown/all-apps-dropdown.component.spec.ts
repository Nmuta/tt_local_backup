import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { createMockWindowService } from '@services/window';
import { createMockZendeskService } from '@services/zendesk';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { AllAppsDropdownComponent } from './all-apps-dropdown.component';
import { UserModel } from '@models/user.model';
import { UserRole } from '@models/enums';
import faker from 'faker';

describe('AllAppsDropdownComponent', () => {
  let fixture: ComponentFixture<AllAppsDropdownComponent>;
  let component: AllAppsDropdownComponent;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [AllAppsDropdownComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockZendeskService(),
          createMockLoggerService(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AllAppsDropdownComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('If profile role is LiveOpsAdmin', () => {
      beforeEach(() => {
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
          emailAddress: `${faker.name.firstName()}@microsofttest.fake`,
          role: UserRole.LiveOpsAdmin,
          name: faker.name.firstName(),
        } as UserModel);
      });

      it('should set showAllAppsDropdown to true', () => {
        component.ngOnInit();

        expect(component.showAllAppsDropdown).toBeTruthy();
      });
    });

    describe('If profile role is not LiveOpsAdmin', () => {
      beforeEach(() => {
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
          emailAddress: `${faker.name.firstName()}@microsofttest.fake`,
          role: UserRole.SupportAgent,
          name: faker.name.firstName(),
        } as UserModel);
      });

      it('should set showAllAppsDropdown to false', () => {
        component.ngOnInit();

        expect(component.showAllAppsDropdown).toBeFalsy();
      });
    });
  });
});
