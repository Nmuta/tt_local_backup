import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadShowroomService } from './steelhead-showroom.service';

describe('SteelheadShowroomService', () => {
  let service: SteelheadShowroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadShowroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
