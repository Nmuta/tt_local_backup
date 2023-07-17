import { Injectable, Provider } from '@angular/core';

import { ScrutineerDataParser } from './scrutineer-data-parser.helper';

/** Mock for the scrutineer data parser. */
@Injectable()
export class MockScrutineerDataParser {
  public copyMessage = jasmine.createSpy('copyMessage');
}

/** Creates an injectable mock for the Scrutineer Data Parser. */
export function createMockScrutineerDataParser(): Provider {
  return {
    provide: ScrutineerDataParser,
    useValue: new MockScrutineerDataParser(),
  };
}
