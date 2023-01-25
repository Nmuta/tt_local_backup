import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SunrisePlayerCreditUpdatesService } from './sunrise-credit-updates.service';

describe('SunrisePlayerCreditUpdatesService', () => {
  let service: SunrisePlayerCreditUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SunrisePlayerCreditUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
