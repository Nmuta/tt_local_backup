import { TestBed, inject } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { WindowService } from './window.service';

describe('service: WindowService', () => {
  let store: Store;
  let service: WindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      providers: [WindowService],
    });

    store = TestBed.inject(Store);
    service = TestBed.inject(WindowService);
  });

  it('should be created', inject([WindowService], (service: WindowService) => {
    expect(service).toBeTruthy();
  }));

  describe('Actions:', () => {
    it('OpenWindow should work', () => {

    });
  });
});
