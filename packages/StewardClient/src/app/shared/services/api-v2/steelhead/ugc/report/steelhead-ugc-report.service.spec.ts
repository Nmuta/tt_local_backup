import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcReportService } from './steelhead-ugc-report.service';

describe('FindService', () => {
  let service: SteelheadUgcReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
