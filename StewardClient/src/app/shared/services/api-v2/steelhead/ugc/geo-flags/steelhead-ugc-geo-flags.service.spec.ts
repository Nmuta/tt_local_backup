import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcGeoFlagsService } from './steelhead-ugc-geo-flags.service';

describe('FindService', () => {
  let service: SteelheadUgcGeoFlagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcGeoFlagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
