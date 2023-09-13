import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockLspTaskService } from './woodstock-lsp-tasks.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockLspTaskService', () => {
  let service: WoodstockLspTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockLspTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
