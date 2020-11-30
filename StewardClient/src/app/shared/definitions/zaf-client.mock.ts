import { Provider } from "@angular/core";

/** A Mock ZAF client. */
export class MockZafClient {

}

/** Creates an injectable mock for API Service. */
export function createMockApiService(): Provider {
  return {
    provide: ZAFClient.init,
    useValue: new MockZafClient(),
  };
}
