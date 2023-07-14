import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockServicesTableStorageService } from './services-table-storage.service';

describe('WoodstockServicesTableStorageService', () => {
  let service: WoodstockServicesTableStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockServicesTableStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
