import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockAuctionBlocklistService } from './woodstock-auction-blocklist.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'WoodstockAuctionBlocklistService', () => {
  let service: WoodstockAuctionBlocklistService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockWoodstockAuctionBlocklistService: WoodstockAuctionBlocklistService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [WoodstockAuctionBlocklistService],
      }),
    ).compileComponents();

    service = TestBed.inject(WoodstockAuctionBlocklistService);

    mockWoodstockAuctionBlocklistService = TestBed.inject(WoodstockAuctionBlocklistService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
