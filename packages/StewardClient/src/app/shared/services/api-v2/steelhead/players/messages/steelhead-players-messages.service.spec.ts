import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayersMessagesService } from './steelhead-players-messages.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadPlayerMessagesService', () => {
  let service: SteelheadPlayersMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadPlayersMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
