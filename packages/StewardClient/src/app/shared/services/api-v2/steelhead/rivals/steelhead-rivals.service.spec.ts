import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadRivalsService } from './steelhead-rivals.service';

describe('SteelheadRivalsService', () => {
  let service: SteelheadRivalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadRivalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
