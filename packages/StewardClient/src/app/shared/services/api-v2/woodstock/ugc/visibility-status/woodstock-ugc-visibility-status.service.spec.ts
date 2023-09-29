import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcVisibilityStatusService } from './woodstock-ugc-visibility-status.service';

describe('WoodstockUgcVisibilityStatusService', () => {
  let service: WoodstockUgcVisibilityStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcVisibilityStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
