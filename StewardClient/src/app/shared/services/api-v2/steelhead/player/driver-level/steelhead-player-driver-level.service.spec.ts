import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerDriverLevelService } from './steelhead-player-driver-level.service';

describe('SteelheadPlayerDriverLevelService', () => {
  let service: SteelheadPlayerDriverLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerDriverLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
