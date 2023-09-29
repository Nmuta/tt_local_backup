import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadGroupMessagesService } from './steelhead-group-messages.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadGroupMessagesService', () => {
  let service: SteelheadGroupMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadGroupMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
