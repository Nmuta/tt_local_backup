import { TestBed, inject } from '@angular/core/testing';
import { WindowService } from './window.service';

describe('service: WindowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [WindowService],
    });
  });

  it('should be created', inject([WindowService], (service: WindowService) => {
    expect(service).toBeTruthy();
  }));
});
