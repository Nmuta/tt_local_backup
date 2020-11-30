import { Provider } from '@angular/core';
import { ZAFCLIENT_TOKEN } from '@services/zendesk';

/** A Mock ZAF client. */
export class MockZafClient {

  public get = jasmine.createSpy('get');
  public request = jasmine.createSpy('request');
  public context = jasmine.createSpy('context');
  public invoke = jasmine.createSpy('invoke');
}

/** Creates an injectable mock for ZAF Client. */
export function createMockZafClient(): Provider {
  return {
    provide: ZAFCLIENT_TOKEN,
    useValue: new MockZafClient(),
  };
}
