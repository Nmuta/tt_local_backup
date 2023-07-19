import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MsTeamsService } from './ms-teams.service';

describe('MsTeamsService', () => {
  let service: MsTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MsTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
