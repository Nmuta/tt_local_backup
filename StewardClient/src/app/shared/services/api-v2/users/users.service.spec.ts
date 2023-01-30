import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { V2UsersService } from './users.service';

describe('V2UsersService', () => {
  let service: V2UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(V2UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
