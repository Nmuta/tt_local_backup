import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadBanService } from './steelhead-ban.service';

describe('SteelheadBanService', () => {
  let service: SteelheadBanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadBanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
