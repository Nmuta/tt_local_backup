import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcHideService } from './woodstock-ugc-hide.service';

describe('FindService', () => {
  let service: WoodstockUgcHideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcHideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
