import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadBanHistoryService } from './steelhead-ban-history.service';

describe('SteelheadBanHistoryService', () => {
  let service: SteelheadBanHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadBanHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
