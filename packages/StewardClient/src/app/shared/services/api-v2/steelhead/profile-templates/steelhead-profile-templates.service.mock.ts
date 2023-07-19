import { Injectable, Provider } from '@angular/core';
import faker from '@faker-js/faker';
import { Observable, of } from 'rxjs';

import { SteelheadProfileTemplatesService } from './steelhead-profile-templates.service';

/** Defines the mock for the SteelheadProfileTemplateService. */
@Injectable()
export class MockSteelheadProfileTemplateService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getProfileTemplates$ = jasmine
    .createSpy('getProfileTemplates')
    .and.returnValue(of(Array(10).map(() => faker.random.word())));
}

/** Creates an injectable mock for Woodstock Player Service. */
export function createMockSteelheadProfileTemplateService(): Provider {
  return {
    provide: SteelheadProfileTemplatesService,
    useValue: new MockSteelheadProfileTemplateService(),
  };
}
