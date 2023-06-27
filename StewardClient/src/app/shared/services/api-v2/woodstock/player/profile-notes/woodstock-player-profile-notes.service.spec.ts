import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockPlayerProfileNotesService } from './woodstock-player-profile-notes.service';

describe('WoodstockPlayerProfileNotesService', () => {
  let service: WoodstockPlayerProfileNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockPlayerProfileNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
