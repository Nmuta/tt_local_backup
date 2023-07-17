import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { NgxsModule, Store } from '@ngxs/store';
import { WindowOpen } from './window.actions';
import { WindowService } from './window.service';

describe('service: WindowService', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([WindowService])],
      providers: [WindowService],
      schemas: [NO_ERRORS_SCHEMA],
    });

    store = TestBed.inject(Store);
  });

  it('should be created', inject([WindowService], (service: WindowService) => {
    expect(service).toBeTruthy();
  }));

  describe('Actions:', () => {
    it('OpenWindow should work', () => {
      const oldOpen = window.open;
      window.open = jasmine.createSpy('open');
      const fake = new WindowOpen(faker.internet.url(), faker.datatype.uuid());
      store.dispatch(fake);

      expect(window.open).toHaveBeenCalledWith(fake.url, fake.target);
      window.open = oldOpen;
    });
  });
});
