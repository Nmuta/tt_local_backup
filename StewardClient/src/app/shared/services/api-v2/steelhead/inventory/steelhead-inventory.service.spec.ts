import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadInventoryService } from './steelhead-inventory.service';

describe('SteelheadInventoryService', () => {
  let service: SteelheadInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
