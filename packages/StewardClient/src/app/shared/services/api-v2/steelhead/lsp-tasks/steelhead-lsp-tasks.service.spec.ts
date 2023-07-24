import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadLspTaskService } from './steelhead-lsp-tasks.service';

describe('SteelheadLspTaskService', () => {
  let service: SteelheadLspTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadLspTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
