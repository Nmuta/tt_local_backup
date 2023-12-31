import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import faker from '@faker-js/faker';
import { EndpointKeyMemoryState } from './endpoint-key-memory.state';
import { InitEndpointKeys } from './endpoint-key-memory.actions';
import { of } from 'rxjs';
import { createMockSettingsService, SettingsService } from '@services/settings/settings';
import { LspEndpoints } from '@models/lsp-endpoints';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('EndpointKeyMemoryState', () => {
  let store: Store;
  let service: EndpointKeyMemoryState;
  let mockSettingsService: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [NgxsModule.forRoot([EndpointKeyMemoryState])],
        providers: [createMockSettingsService()],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    );
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
      forte: [{ name: faker.random.word() }],
      forum: [{ name: faker.random.word() }],
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

      const forteValue = store.selectSnapshot<string[]>(EndpointKeyMemoryState.forteEndpointKeys);
      const forumValue = store.selectSnapshot<string[]>(EndpointKeyMemoryState.forumEndpointKeys);

      expect(apolloValue).toEqual(endpoints.apollo.map(x => x.name));
      expect(sunriseValue).toEqual(endpoints.sunrise.map(x => x.name));
      expect(woodstockValue).toEqual(endpoints.woodstock.map(x => x.name));
      expect(steelheadValue).toEqual(endpoints.steelhead.map(x => x.name));
      expect(forteValue).toEqual(endpoints.forte.map(x => x.name));
      expect(forumValue).toEqual(endpoints.forum.map(x => x.name));
    });
  });
});
