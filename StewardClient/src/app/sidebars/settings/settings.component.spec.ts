import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';

import { SettingsComponent } from './settings.component';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { UserModel } from '@models/user.model';
import { UserRole } from '@models/enums';
import { createMockWindowService, WindowService } from '@services/window';
import { SetFakeApi, SetStagingApi } from '@shared/state/user-settings/user-settings.actions';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let mockStore: Store;
  let mockWindowService: WindowService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserSettingsState])],
      declarations: [SettingsComponent],
      providers: [createMockWindowService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
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
    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
      emailAddress: 'fake-email',
      name: 'fake-name',
      role: UserRole.LiveOpsAdmin,
    } as UserModel);
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: syncFakeApiSettings', () => {
    describe('When enableFakeApi is true', () => {
      const expectedVal = true;
      beforeEach(() => {
        component.enableFakeApi = expectedVal;
      });
      it('should set fake api', () => {
        component.syncFakeApiSettings();

        expect(mockStore.dispatch).toHaveBeenCalledWith(new SetFakeApi(expectedVal));
      });
    });

    describe('When enableFakeApi is false', () => {
      const expectedVal = false;
      beforeEach(() => {
        component.enableFakeApi = expectedVal;
      });
      it('should set fake api', () => {
        component.syncFakeApiSettings();

        expect(mockStore.dispatch).toHaveBeenCalledWith(new SetFakeApi(expectedVal));
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
