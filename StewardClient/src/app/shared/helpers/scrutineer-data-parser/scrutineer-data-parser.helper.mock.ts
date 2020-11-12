import { Injectable } from '@angular/core';

import { ScrutineerDataParser } from './scrutineer-data-parser.helper';

/** Mock for the scrutineer data parser. */
@Injectable()
export class MockScrutineerDataParser {
  public copyMessage = jasmine.createSpy('copyMessage');
}

export function createMockScrutineerDataParser(): Provider {
  return {
    provide: ScrutineerDataParser,
    useValue: new MockScrutineerDataParser(),
  };
}
