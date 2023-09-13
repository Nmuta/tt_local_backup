import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerProfileNotesService } from './steelhead-player-profile-notes.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadPlayerProfileNotesService', () => {
  let service: SteelheadPlayerProfileNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerProfileNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
