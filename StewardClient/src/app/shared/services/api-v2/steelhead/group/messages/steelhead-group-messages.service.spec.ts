import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadGroupMessagesService } from './steelhead-group-messages.service';

describe('SteelheadGroupMessagesService', () => {
  let service: SteelheadGroupMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadGroupMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
