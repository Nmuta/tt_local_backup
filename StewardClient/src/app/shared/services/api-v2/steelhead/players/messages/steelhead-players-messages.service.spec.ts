import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayersMessagesService } from './steelhead-players-messages.service';

describe('SteelheadPlayerMessagesService', () => {
  let service: SteelheadPlayersMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayersMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
