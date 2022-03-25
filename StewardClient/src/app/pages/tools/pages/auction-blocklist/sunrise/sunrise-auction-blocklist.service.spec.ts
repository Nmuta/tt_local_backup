import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseAuctionBlocklistService } from './sunrise-auction-blocklist.service';

describe('SunriseAuctionBlocklistService', () => {
  let service: SunriseAuctionBlocklistService;
  let mockSunriseAuctionBlocklistService: SunriseAuctionBlocklistService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SunriseAuctionBlocklistService],
    }).compileComponents();

    service = TestBed.inject(SunriseAuctionBlocklistService);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockSunriseAuctionBlocklistService = TestBed.inject(SunriseAuctionBlocklistService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
