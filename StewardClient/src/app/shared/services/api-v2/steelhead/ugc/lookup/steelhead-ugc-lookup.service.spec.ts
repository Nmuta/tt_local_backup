import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcLookupService } from './steelhead-ugc-lookup.service';

describe('SteelheadUgcLookupService', () => {
  let service: SteelheadUgcLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
