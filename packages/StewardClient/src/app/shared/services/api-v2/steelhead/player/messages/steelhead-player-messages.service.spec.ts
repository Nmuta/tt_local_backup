import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerMessagesService } from './steelhead-player-messages.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadPlayerMessagesService', () => {
  let service: SteelheadPlayerMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
