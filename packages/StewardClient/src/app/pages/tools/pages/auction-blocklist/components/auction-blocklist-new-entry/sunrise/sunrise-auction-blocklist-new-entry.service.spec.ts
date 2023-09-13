import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseAuctionBlocklistNewEntryService } from './sunrise-auction-blocklist-new-entry.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SunriseAuctionBlocklistNewEntryService', () => {
  let service: SunriseAuctionBlocklistNewEntryService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockSunriseAuctionBlocklistService: SunriseAuctionBlocklistNewEntryService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [SunriseAuctionBlocklistNewEntryService],
      }),
    ).compileComponents();

    service = TestBed.inject(SunriseAuctionBlocklistNewEntryService);

    mockSunriseAuctionBlocklistService = TestBed.inject(SunriseAuctionBlocklistNewEntryService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
