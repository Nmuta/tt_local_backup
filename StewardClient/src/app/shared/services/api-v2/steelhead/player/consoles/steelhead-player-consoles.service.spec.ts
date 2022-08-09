import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerConsolesService } from './steelhead-player-consoles.service';

describe('SteelheadPlayerConsolesService', () => {
  let service: SteelheadPlayerConsolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerConsolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
