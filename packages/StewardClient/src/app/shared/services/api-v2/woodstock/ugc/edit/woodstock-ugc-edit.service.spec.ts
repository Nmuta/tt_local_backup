import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcEditService } from './woodstock-ugc-edit.service';

describe('WoodstockUgcEditService', () => {
  let service: WoodstockUgcEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
