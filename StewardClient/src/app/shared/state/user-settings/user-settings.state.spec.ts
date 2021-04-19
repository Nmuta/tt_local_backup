import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { AppState } from '../app-state';
import { SetFakeApi, SetStagingApi } from './user-settings.actions';

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
});
