import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPegasusService } from './steelhead-pegasus.service';

describe('SteelheadPegasusService', () => {
  let service: SteelheadPegasusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPegasusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
