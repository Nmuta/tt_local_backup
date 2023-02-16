import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadImageTextTileService } from './steelhead-image-text-tiles.service';

describe('SteelheadImageTextTileService', () => {
  let service: SteelheadImageTextTileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadImageTextTileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
