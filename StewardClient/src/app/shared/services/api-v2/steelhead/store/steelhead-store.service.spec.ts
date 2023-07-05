import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadStoreService } from './steelhead-store.service';

describe('SteelheadStoreService', () => {
  let service: SteelheadStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
