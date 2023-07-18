import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockTaskService } from './woodstock-task.service';

describe('WoodstockTaskService', () => {
  let service: WoodstockTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
