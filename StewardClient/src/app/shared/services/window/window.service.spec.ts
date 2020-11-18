﻿import { TestBed, inject } from '@angular/core/testing';
import { faker } from '@interceptors/fake-api/utility';
import { NgxsModule, Store } from '@ngxs/store';
import { WindowOpen } from './window.actions';
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
      service.open = jasmine.createSpy('open');
      const fake = new WindowOpen(faker.internet.url(), faker.random.uuid());
      store.dispatch(fake);

      expect(service.open).toHaveBeenCalledWith(fake.url, fake.target);
    });
  });
});
