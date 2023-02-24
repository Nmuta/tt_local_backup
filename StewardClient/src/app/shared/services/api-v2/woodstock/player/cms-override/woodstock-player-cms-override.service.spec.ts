import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockPlayerCmsOverrideService } from './woodstock-player-cms-override.service';

describe('WoodstockPlayerCmsOverrideService', () => {
  let service: WoodstockPlayerCmsOverrideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockPlayerCmsOverrideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
