import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerCreditUpdatesService } from './steelhead-credit-updates.service';

describe('SteelheadPlayerCreditUpdatesService', () => {
  let service: SteelheadPlayerCreditUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerCreditUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
