import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcHideStatusService } from './steelhead-ugc-hide-status.service';

describe('SteelheadUgcHideStatusService', () => {
  let service: SteelheadUgcHideStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcHideStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
