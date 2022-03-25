import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockWindowService, WindowService } from '@services/window';
import { SetStagingApi } from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { of } from 'rxjs';
import faker from '@faker-js/faker';

import { AvailableAppsComponent } from './available-apps.component';

describe('AvailableAppsComponent', () => {
  let component: AvailableAppsComponent;
  let fixture: ComponentFixture<AvailableAppsComponent>;

  let mockStore: Store;
  let mockWindowService: WindowService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserSettingsState]),
      ],
      declarations: [AvailableAppsComponent],
      providers: [createMockWindowService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableAppsComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of(<UserSettingsStateModel>{
      enableFakeApi: false,
    });

    mockStore = TestBed.inject(Store);
    mockWindowService = TestBed.inject(WindowService);

    mockStore.dispatch = jasmine.createSpy('dispatch');
    mockWindowService.location = jasmine
      .createSpy('location')
      .and.returnValue({ origin: 'http://microsoft.test' });

    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot');
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When user role is LiveOpsAdmin', () => {
      beforeEach(() => {
        const name = faker.name.firstName();
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
          emailAddress: `${name}@testemail.com`,
          name: name,
          role: UserRole.LiveOpsAdmin,
        } as UserModel);
      });

      it('should set correct app availability', () => {
        component.ngOnInit();

        expect(component.areAnyAppsAccessible).toBeTruthy();
        expect(component.areZendeskAppsAccessible).toBeTruthy();
      });
    });

    describe('When user role is SupportAgent', () => {
      beforeEach(() => {
        const name = faker.name.firstName();
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
          emailAddress: `${name}@testemail.com`,
          name: name,
          role: UserRole.SupportAgent,
        } as UserModel);
      });

      it('should set correct app availability', () => {
        component.ngOnInit();

        expect(component.areAnyAppsAccessible).toBeTruthy();
        expect(component.areZendeskAppsAccessible).toBeTruthy();
      });
    });
    describe('When user role is DataPipeline', () => {
      beforeEach(() => {
        const name = faker.name.firstName();
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
          emailAddress: `${name}@testemail.com`,
          name: name,
          role: UserRole.DataPipelineAdmin,
        } as UserModel);
      });

      it('should set correct app availability', () => {
        component.ngOnInit();

        expect(component.areAnyAppsAccessible).toBeTruthy();
        expect(component.areZendeskAppsAccessible).toBeFalsy();
      });
    });
    describe('When user role is CommunityManager', () => {
      beforeEach(() => {
        const name = faker.name.firstName();
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
          emailAddress: `${name}@testemail.com`,
          name: name,
          role: UserRole.CommunityManager,
        } as UserModel);
      });

      it('should set correct app availability', () => {
        component.ngOnInit();

        expect(component.areAnyAppsAccessible).toBeTruthy();
        expect(component.areZendeskAppsAccessible).toBeFalsy();
      });
    });
  });

  describe('Method: syncStagingApiSettings', () => {
    describe('When enableStagingApi is true', () => {
      const expectedVal = true;
      beforeEach(() => {
        component.enableStagingApi = expectedVal;
      });
      it('should set fake api', () => {
        component.syncStagingApiSettings();

        expect(mockStore.dispatch).toHaveBeenCalledWith(new SetStagingApi(expectedVal));
      });
    });

    describe('When enableStagingApi is false', () => {
      const expectedVal = false;
      beforeEach(() => {
        component.enableStagingApi = expectedVal;
      });
      it('should set fake api', () => {
        component.syncStagingApiSettings();

        expect(mockStore.dispatch).toHaveBeenCalledWith(new SetStagingApi(expectedVal));
      });
    });
  });
});
