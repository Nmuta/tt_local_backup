import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WoodstockUgcSearchService } from './woodstock-ugc-search.service';

describe('FindService', () => {
  let service: WoodstockUgcSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
