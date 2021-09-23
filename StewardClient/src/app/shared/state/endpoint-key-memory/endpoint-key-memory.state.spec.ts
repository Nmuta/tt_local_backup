import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import faker from 'faker';
import { EndpointKeyMemoryState } from './endpoint-key-memory.state';
import { InitEndpointKeys } from './endpoint-key-memory.actions';
import { of } from 'rxjs';
import { createMockSettingsService, SettingsService } from '@services/settings';
import { LspEndpoints } from '@models/lsp-endpoints';

describe('EndpointKeyMemoryState', () => {
  let store: Store;
  let service: EndpointKeyMemoryState;
  let mockSettingsService: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([EndpointKeyMemoryState])],
      providers: [createMockSettingsService()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(EndpointKeyMemoryState);
    store = TestBed.inject(Store);
    mockSettingsService = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Action: InitEndpointKeys', () => {
    const endpoints: LspEndpoints = {
      apollo: [{ name: faker.random.word() }],
      sunrise: [{ name: faker.random.word() }],
      woodstock: [{ name: faker.random.word() }],
      steelhead: [{ name: faker.random.word() }],
    };

    beforeEach(() => {
      mockSettingsService.getLspEndpoints$ = jasmine
        .createSpy('getLspEndpoints$')
        .and.returnValue(of(endpoints));
    });

    it('should sync setting: InitEndpointKeys()', () => {
      store.dispatch(new InitEndpointKeys());
      const apolloValue = store.selectSnapshot<string[]>(EndpointKeyMemoryState.apolloEndpointKeys);
      const sunriseValue = store.selectSnapshot<string[]>(
        EndpointKeyMemoryState.sunriseEndpointKeys,
      );
      const woodstockValue = store.selectSnapshot<string[]>(
        EndpointKeyMemoryState.woodstockEndpointKeys,
      );
      const steelheadValue = store.selectSnapshot<string[]>(
        EndpointKeyMemoryState.steelheadEndpointKeys,
      );

      expect(apolloValue).toEqual(endpoints.apollo.map(x => x.name));
      expect(sunriseValue).toEqual(endpoints.sunrise.map(x => x.name));
      expect(woodstockValue).toEqual(endpoints.woodstock.map(x => x.name));
      expect(steelheadValue).toEqual(endpoints.steelhead.map(x => x.name));
    });
  });
});
