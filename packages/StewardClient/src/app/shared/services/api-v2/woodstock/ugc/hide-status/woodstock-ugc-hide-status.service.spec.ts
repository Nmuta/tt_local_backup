import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcHideStatusService } from './woodstock-ugc-hide-status.service';

describe('WoodstockUgcHideStatusService', () => {
  let service: WoodstockUgcHideStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcHideStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
