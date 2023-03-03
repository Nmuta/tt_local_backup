import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ForumBanService } from './forum-ban.service';

describe('ForumBanService', () => {
  let service: ForumBanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ForumBanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
