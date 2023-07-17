import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';

import { SettingsComponent } from './settings.component';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { UserModel } from '@models/user.model';
import { UserRole } from '@models/enums';
import { WindowService } from '@services/window';
import { SetFakeApi, SetStagingApi } from '@shared/state/user-settings/user-settings.actions';
import {
  EndpointKeyMemoryModel,
  EndpointKeyMemoryState,
} from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let mockStore: Store;
  let mockWindowService: WindowService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [SettingsComponent],
        ngxsModules: [EndpointKeyMemoryState],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'userSettings$', { writable: true });
    component.userSettings$ = of(<UserSettingsStateModel>{
      enableFakeApi: false,
      apolloEndpointKey: '',
      sunriseEndpointKey: '',
      woodstockEndpointKey: '',
      steelheadEndpointKey: '',
    });

    Object.defineProperty(component, 'endpointKeys$', { writable: true });
    component.endpointKeys$ = of(<EndpointKeyMemoryModel>{
      Apollo: [],
      Sunrise: [],
      Woodstock: [],
      Steelhead: [],
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
