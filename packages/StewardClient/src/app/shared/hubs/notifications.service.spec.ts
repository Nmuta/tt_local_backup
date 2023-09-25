import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockReauthService } from '@shared/state/utilities/reauth.service.mock';

import { NotificationsService } from './notifications.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [NgxsModule.forRoot()],
        providers: [createMockReauthService(), createMockLoggerService()],
      }),
    );
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', waitForAsync(async () => {
    expect(service).toBeTruthy();
  }));
});
