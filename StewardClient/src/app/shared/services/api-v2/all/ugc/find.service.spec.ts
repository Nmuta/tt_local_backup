import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MultipleUgcFindService } from './find.service';

describe('FindService', () => {
  let service: MultipleUgcFindService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MultipleUgcFindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
