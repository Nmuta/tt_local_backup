import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadServicesTableStorageService } from './services-table-storage.service';

describe('SteelheadConsolesService', () => {
  let service: SteelheadServicesTableStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadServicesTableStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
