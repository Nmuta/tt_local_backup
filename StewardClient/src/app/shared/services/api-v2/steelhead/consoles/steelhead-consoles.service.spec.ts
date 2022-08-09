import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadConsolesService } from './steelhead-consoles.service';

describe('SteelheadConsolesService', () => {
  let service: SteelheadConsolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadConsolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
