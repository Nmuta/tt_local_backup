import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadGenericPopupTileService } from './steelhead-generic-popup-tiles.service';

describe('SteelheadGenericPopupTileService', () => {
  let service: SteelheadGenericPopupTileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadGenericPopupTileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
