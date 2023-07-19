import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadCarsService } from './steelhead-cars.service';

describe('SteelheadCarsService', () => {
  let service: SteelheadCarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadCarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
