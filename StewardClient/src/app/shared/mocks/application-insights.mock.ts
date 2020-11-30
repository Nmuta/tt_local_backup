import { Provider } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

/** A mock for Application Insights. */
export class MockApplicationInsights {
  public trackTrace = jasmine.createSpy('trackTrace');
}

/** Creates an injectable mock for Application Insights. */
export function createMockApplicationInsights(): Provider {
  return {
    provide: ApplicationInsights,
    useValue: new MockApplicationInsights(),
    multi: false,
  };
}
