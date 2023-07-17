import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SunrisePlayerProfileNotesService } from './sunrise-player-profile-notes.service';

describe('SunrisePlayerProfileNotesService', () => {
  let service: SunrisePlayerProfileNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SunrisePlayerProfileNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
