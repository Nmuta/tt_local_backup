import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockStorefrontService } from './woodstock-storefront.service';

describe('WoodstockStorefrontService', () => {
  let service: WoodstockStorefrontService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockStorefrontService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
