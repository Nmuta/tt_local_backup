import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayersService } from './steelhead-players.service';

describe('SteelheadPlayersService', () => {
  let service: SteelheadPlayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
