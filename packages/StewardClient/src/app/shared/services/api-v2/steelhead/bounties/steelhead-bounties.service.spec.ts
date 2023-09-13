import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadBountiesService } from './steelhead-bounties.service';

describe('SteelheadBountiesService', () => {
  let service: SteelheadBountiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadBountiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
