import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcSharecodeService } from './woodstock-ugc-sharecode.service';

describe('WoodstockUgcSharecodeService', () => {
  let service: WoodstockUgcSharecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcSharecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
