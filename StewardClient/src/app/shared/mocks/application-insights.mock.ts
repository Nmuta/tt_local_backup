import { ApplicationInsights } from '@microsoft/applicationinsights-web';

/** A mock for Application Insights. */
export class MockApplicationInsights {
  public trackTrace = jasmine.createSpy('trackTrace');
}

export function createMockApplicationInsights() {
  return {
    provide: ApplicationInsights,
    useValue: new MockApplicationInsights(),
    multi: false,
  };
}
