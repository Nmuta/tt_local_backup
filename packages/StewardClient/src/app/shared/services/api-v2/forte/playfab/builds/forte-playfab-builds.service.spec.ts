import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FortePlayFabBuildsService } from './forte-playfab-builds.service';

describe('FortePlayFabBuildsService', () => {
  let service: FortePlayFabBuildsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FortePlayFabBuildsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
