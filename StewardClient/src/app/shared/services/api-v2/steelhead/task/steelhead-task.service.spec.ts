import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadTaskService } from './steelhead-task.service';

describe('SteelheadTaskService', () => {
  let service: SteelheadTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
