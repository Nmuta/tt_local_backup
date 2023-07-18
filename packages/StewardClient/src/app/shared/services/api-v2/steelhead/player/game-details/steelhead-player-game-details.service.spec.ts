import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerGameDetailsService } from './steelhead-player-game-details.service';

describe('SteelheadPlayerGameDetailservice', () => {
  let service: SteelheadPlayerGameDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerGameDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
