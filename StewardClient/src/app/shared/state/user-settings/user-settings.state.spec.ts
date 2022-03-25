import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { AppState } from '../app-state';
import {
  ConfigureAppUpdatePopup,
  SetApolloEndpointKey,
  SetAppVersion,
  SetFakeApi,
  SetStagingApi,
  SetSteelheadEndpointKey,
  SetSunriseEndpointKey,
  SetWoodstockEndpointKey,
} from './user-settings.actions';
import faker from '@faker-js/faker';

import { UserSettingsState } from './user-settings.state';

describe('UserSettingsService', () => {
  let store: Store;
  let service: UserSettingsState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserSettingsState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(UserSettingsState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Action: SetFakeApi', () => {
    it('should sync setting: SetFakeApi(true)', () => {
      store.dispatch(new SetFakeApi(true));
      store
        .selectOnce((state: AppState) => state.userSettings.enableFakeApi)
        .subscribe(enableFakeApi => {
          expect(enableFakeApi).toBe(true);
        });
    });

    it('should sync setting: SetFakeApi(false)', () => {
      store.dispatch(new SetFakeApi(false));
      store
        .selectOnce((state: AppState) => state.userSettings.enableFakeApi)
        .subscribe(enableFakeApi => {
          expect(enableFakeApi).toBe(false);
        });
    });
  });

  describe('Action: SetStagingApi', () => {
    it('should sync setting: SetStagingApi(true)', () => {
      store.dispatch(new SetStagingApi(true));
      store
        .selectOnce((state: AppState) => state.userSettings.enableStagingApi)
        .subscribe(enableFakeApi => {
          expect(enableFakeApi).toBe(true);
        });
    });

    it('should sync setting: SetStagingApi(false)', () => {
      store.dispatch(new SetStagingApi(false));
      store
        .selectOnce((state: AppState) => state.userSettings.enableStagingApi)
        .subscribe(enableFakeApi => {
          expect(enableFakeApi).toBe(false);
        });
    });
  });

  describe('Action: SetAppVersion', () => {
    const newAppVersion = faker.random.word();
    it('should sync setting: SetAppVersion()', () => {
      store.dispatch(new SetAppVersion(newAppVersion));
      store
        .selectOnce((state: AppState) => state.userSettings.appVersion)
        .subscribe(version => {
          expect(version).toBe(newAppVersion);
        });
    });
  });

  describe('Action: ConfigureAppUpdatePopup', () => {
    const showPopup = faker.datatype.boolean();
    it('should sync setting: ConfigureAppUpdatePopup()', () => {
      store.dispatch(new ConfigureAppUpdatePopup(showPopup));
      store
        .selectOnce((state: AppState) => state.userSettings.showAppUpdatePopup)
        .subscribe(showPopup => {
          expect(showPopup).toBe(showPopup);
        });
    });
  });

  describe('Action: SetSunriseEndpointKey', () => {
    const endpoint = 'Retail';
    it('should sync setting: SetSunriseEndpointKey()', () => {
      store.dispatch(new SetSunriseEndpointKey(endpoint));
      store
        .selectOnce((state: AppState) => state.userSettings.sunriseEndpointKey)
        .subscribe(endpoint => {
          expect(endpoint).toBe(endpoint);
        });
    });
  });

  describe('Action: SetApolloEndpointKey', () => {
    const endpoint = 'Retail';
    it('should sync setting: SetApolloEndpointKey()', () => {
      store.dispatch(new SetApolloEndpointKey(endpoint));
      store
        .selectOnce((state: AppState) => state.userSettings.apolloEndpointKey)
        .subscribe(endpoint => {
          expect(endpoint).toBe(endpoint);
        });
    });
  });

  describe('Action: SetWoodstockEndpointKey', () => {
    const endpoint = 'Development';
    it('should sync setting: SetWoodstockEndpointKey()', () => {
      store.dispatch(new SetWoodstockEndpointKey(endpoint));
      store
        .selectOnce((state: AppState) => state.userSettings.woodstockEndpointKey)
        .subscribe(endpoint => {
          expect(endpoint).toBe(endpoint);
        });
    });
  });

  describe('Action: SetSteelheadEndpointKey', () => {
    const endpoint = 'Development';
    it('should sync setting: SetSteelheadEndpointKey()', () => {
      store.dispatch(new SetSteelheadEndpointKey(endpoint));
      store
        .selectOnce((state: AppState) => state.userSettings.steelheadEndpointKey)
        .subscribe(endpoint => {
          expect(endpoint).toBe(endpoint);
        });
    });
  });
});
