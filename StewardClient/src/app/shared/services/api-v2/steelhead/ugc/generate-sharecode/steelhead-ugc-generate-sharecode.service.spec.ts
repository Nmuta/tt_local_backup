import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcGenerateSharecodeService } from './steelhead-ugc-generate-sharecode.service';

describe('SteelheadUgcGenerateSharecodeService', () => {
  let service: SteelheadUgcGenerateSharecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcGenerateSharecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
