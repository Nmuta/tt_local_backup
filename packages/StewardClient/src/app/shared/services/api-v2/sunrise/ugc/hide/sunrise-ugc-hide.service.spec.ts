import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SunriseUgcHideService } from './sunrise-ugc-hide.service';

describe('FindService', () => {
  let service: SunriseUgcHideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SunriseUgcHideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
