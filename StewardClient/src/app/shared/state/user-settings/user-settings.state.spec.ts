import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { UserSettingsState } from './user-settings.state';

describe('UserSettingsService', () => {
  let service: UserSettingsState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserSettingsState])],
    });
    service = TestBed.inject(UserSettingsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
