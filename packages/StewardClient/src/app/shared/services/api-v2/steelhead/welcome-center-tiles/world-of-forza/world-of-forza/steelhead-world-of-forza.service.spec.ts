import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadWorldOfForzaService } from './steelhead-world-of-forza.service';

describe('SteelheadWorldOfForzaService', () => {
  let service: SteelheadWorldOfForzaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadWorldOfForzaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
