import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcLookupService } from './woodstock-ugc-lookup.service';

describe('FindService', () => {
  let service: WoodstockUgcLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
