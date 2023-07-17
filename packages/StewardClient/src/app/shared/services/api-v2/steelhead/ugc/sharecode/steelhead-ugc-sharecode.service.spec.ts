import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcSharecodeService } from './steelhead-ugc-sharecode.service';

describe('SteelheadUgcSharecodeService', () => {
  let service: SteelheadUgcSharecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcSharecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
