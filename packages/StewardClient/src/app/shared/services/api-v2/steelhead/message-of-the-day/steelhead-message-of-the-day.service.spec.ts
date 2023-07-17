import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadMessageOfTheDayService } from './steelhead-message-of-the-day.service';

describe('SteelheadMessageOfTheDayService', () => {
  let service: SteelheadMessageOfTheDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadMessageOfTheDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
