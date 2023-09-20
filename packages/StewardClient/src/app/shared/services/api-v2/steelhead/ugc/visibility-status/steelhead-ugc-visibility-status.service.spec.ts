import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcVisibilityStatusService } from './steelhead-ugc-visibility-status.service';

describe('SteelheadUgcVisibilityStatusService', () => {
  let service: SteelheadUgcVisibilityStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcVisibilityStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
