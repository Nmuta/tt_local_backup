import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadItemsService } from './steelhead-items.service';

describe('SteelheadItemsService', () => {
  let service: SteelheadItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
