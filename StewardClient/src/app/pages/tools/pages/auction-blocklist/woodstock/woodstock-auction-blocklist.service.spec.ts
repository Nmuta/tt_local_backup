import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockAuctionBlocklistService } from './woodstock-auction-blocklist.service';

describe('WoodstockAuctionBlocklistService', () => {
  let service: WoodstockAuctionBlocklistService;
  let mockWoodstockAuctionBlocklistService: WoodstockAuctionBlocklistService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [WoodstockAuctionBlocklistService],
      }).compileComponents();

      service = TestBed.inject(WoodstockAuctionBlocklistService);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockWoodstockAuctionBlocklistService = TestBed.inject(WoodstockAuctionBlocklistService);
    }),
  );

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
