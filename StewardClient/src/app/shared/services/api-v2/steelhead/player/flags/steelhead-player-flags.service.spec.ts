import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerFlagsService } from './steelhead-player-flags.service';

describe('SteelheadPlayerFlagsService', () => {
  let service: SteelheadPlayerFlagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerFlagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
