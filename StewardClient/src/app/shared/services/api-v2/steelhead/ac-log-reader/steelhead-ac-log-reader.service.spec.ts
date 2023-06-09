import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadAcLogReaderService } from './steelhead-ac-log-reader.service';

describe('SteelheadAcLogReaderService', () => {
  let service: SteelheadAcLogReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadAcLogReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
