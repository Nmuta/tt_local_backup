import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadGitOperationService } from './steelhead-git-operation.service';

describe('SteelheadGitOperationService', () => {
  let service: SteelheadGitOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadGitOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
