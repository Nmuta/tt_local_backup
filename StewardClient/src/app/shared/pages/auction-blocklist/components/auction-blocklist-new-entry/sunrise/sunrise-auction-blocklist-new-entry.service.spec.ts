import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseAuctionBlocklistNewEntryService } from './sunrise-auction-blocklist-new-entry.service';

describe('SunriseAuctionBlocklistNewEntryService', () => {
  let service: SunriseAuctionBlocklistNewEntryService;
  let mockSunriseAuctionBlocklistService: SunriseAuctionBlocklistNewEntryService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [SunriseAuctionBlocklistNewEntryService],
      }).compileComponents();

      service = TestBed.inject(SunriseAuctionBlocklistNewEntryService);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockSunriseAuctionBlocklistService = TestBed.inject(SunriseAuctionBlocklistNewEntryService);
    }),
  );

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
