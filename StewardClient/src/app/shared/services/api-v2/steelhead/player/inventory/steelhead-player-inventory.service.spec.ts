import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerInventoryService } from './steelhead-player-inventory.service';

describe('SteelheadPlayerInventoryService', () => {
  let service: SteelheadPlayerInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
