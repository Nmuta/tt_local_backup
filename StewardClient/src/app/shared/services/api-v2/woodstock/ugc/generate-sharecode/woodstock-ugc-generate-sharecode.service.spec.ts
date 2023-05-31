import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcGenerateSharecodeService } from './woodstock-ugc-generate-sharecode.service';

describe('WoodstockUgcGenerateSharecodeService', () => {
  let service: WoodstockUgcGenerateSharecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcGenerateSharecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
