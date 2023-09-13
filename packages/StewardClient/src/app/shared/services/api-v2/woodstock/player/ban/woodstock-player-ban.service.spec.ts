import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import { WoodstockPlayerBanService } from './woodstock-player-ban.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockPlayerBanService', () => {
  let service: WoodstockPlayerBanService;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [],
        providers: [createMockApiV2Service(() => nextReturnValue)],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    );
    service = TestBed.inject(WoodstockPlayerBanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
