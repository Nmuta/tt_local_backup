import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockAuctionBlocklistNewEntryService } from './woodstock-auction-blocklist-new-entry.service';

describe('WoodstockAuctionBlocklistNewEntryService', () => {
  let service: WoodstockAuctionBlocklistNewEntryService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockSunriseAuctionBlocklistService: WoodstockAuctionBlocklistNewEntryService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [WoodstockAuctionBlocklistNewEntryService],
    }).compileComponents();

    service = TestBed.inject(WoodstockAuctionBlocklistNewEntryService);

    mockSunriseAuctionBlocklistService = TestBed.inject(WoodstockAuctionBlocklistNewEntryService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
