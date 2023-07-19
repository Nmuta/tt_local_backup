import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ForumBanHistoryService } from './forum-ban-history.service';

describe('ForumBanHistoryService', () => {
  let service: ForumBanHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ForumBanHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
