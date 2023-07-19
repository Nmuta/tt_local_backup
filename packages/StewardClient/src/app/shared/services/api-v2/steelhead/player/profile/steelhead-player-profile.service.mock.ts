import { Injectable, Provider } from '@angular/core';
import faker from '@faker-js/faker';
import { Observable, of } from 'rxjs';

import { SteelheadPlayerProfileService } from './steelhead-player-profile.service';

/** Defines the mock for the WoodstockPlayerService. */
@Injectable()
export class MockSteelheadPlayerProfileService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public savePlayerProfileTemplate$ = jasmine
    .createSpy('savePlayerProfileTemplate')
    .and.returnValue(of(null));

  public loadPlayerProfileTemplate$ = jasmine
    .createSpy('loadPlayerProfileTemplate')
    .and.returnValue(of(faker.datatype.uuid()));

  public resetPlayerProfile$ = jasmine
    .createSpy('resetPlayerProfile')
    .and.returnValue(of(faker.datatype.uuid()));
}
/** Creates an injectable mock for Woodstock Player Service. */
export function createMockSteelheadPlayerProfileService(): Provider {
  return {
    provide: SteelheadPlayerProfileService,
    useValue: new MockSteelheadPlayerProfileService(),
  };
}
