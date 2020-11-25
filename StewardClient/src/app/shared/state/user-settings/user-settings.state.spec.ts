import { TestBed } from '@angular/core/testing';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { AppState } from '../app-state';
import { SetFakeApi } from './user-settings.actions';

import { UserSettingsState } from './user-settings.state';

describe('UserSettingsService', () => {
  let store: Store;
  let service: UserSettingsState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserSettingsState])],
    });
    service = TestBed.inject(UserSettingsState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sync setting: UseFakeAPI(true)', () => {
    store.dispatch(new SetFakeApi(true));
    store
      .selectOnce((state: AppState) => state.userSettings.enableFakeApi)
      .subscribe(enableFakeApi => {
        expect(enableFakeApi).toBe(true);
      });
  });

  it('should sync setting: UseFakeAPI(false)', () => {
    store.dispatch(new SetFakeApi(false));
    store
      .selectOnce((state: AppState) => state.userSettings.enableFakeApi)
      .subscribe(enableFakeApi => {
        expect(enableFakeApi).toBe(false);
      });
  });
});
