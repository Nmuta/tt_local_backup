import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcReportService } from './woodstock-ugc-report.service';

describe('FindService', () => {
  let service: WoodstockUgcReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
