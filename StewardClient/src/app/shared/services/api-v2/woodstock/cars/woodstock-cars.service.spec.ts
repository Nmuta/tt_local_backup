import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockCarsService } from './woodstock-cars.service';

describe('WoodstockCarsService', () => {
  let service: WoodstockCarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockCarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
