import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockAuctionsService } from './woodstock-auctions.service';

describe('WoodstockAuctionsService', () => {
  let service: WoodstockAuctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockAuctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
