import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerReportWeightService } from './steelhead-report-weight.service';

describe('SteelheadPlayerReportWeightService', () => {
  let service: SteelheadPlayerReportWeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerReportWeightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
