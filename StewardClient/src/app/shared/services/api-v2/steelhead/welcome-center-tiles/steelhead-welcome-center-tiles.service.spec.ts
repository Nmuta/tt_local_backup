import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadWelcomeCenterTileService } from './steelhead-welcome-center-tiles.service';

describe('SteelheadWelcomeCenterTileService', () => {
  let service: SteelheadWelcomeCenterTileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadWelcomeCenterTileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
