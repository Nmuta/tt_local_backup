import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockItemsService } from './woodstock-items.service';

describe('WoodstockItemsService', () => {
  let service: WoodstockItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
