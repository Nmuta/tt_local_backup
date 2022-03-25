import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockReauthService } from '@shared/state/utilities/reauth.service.mock';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot()],
      providers: [createMockReauthService(), createMockLoggerService()],
    });
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', waitForAsync(async () => {
    expect(service).toBeTruthy();
  }));
});
