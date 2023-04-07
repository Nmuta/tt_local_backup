import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerCmsOverrideService } from './steelhead-player-cms-override.service';

describe('SteelheadPlayerCmsOverrideService', () => {
  let service: SteelheadPlayerCmsOverrideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerCmsOverrideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
