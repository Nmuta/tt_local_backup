import { TestBed, inject } from '@angular/core/testing';
import { faker } from '@interceptors/fake-api/utility';
import { NgxsModule, Store } from '@ngxs/store';
import { WindowOpen } from './window.actions';
import { WindowService } from './window.service';

describe('service: WindowService', () => {
  let store: Store;
  let service: WindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([WindowService])],
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
      const oldOpen = window.open;
      window.open = jasmine.createSpy('open');
      const fake = new WindowOpen(faker.internet.url(), faker.random.uuid());
      store.dispatch(fake);

      expect(window.open).toHaveBeenCalledWith(fake.url, fake.target);
      window.open = oldOpen;
    });
  });
});
