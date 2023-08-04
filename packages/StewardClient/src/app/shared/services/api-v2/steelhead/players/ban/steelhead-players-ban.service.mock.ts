import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SteelheadPlayersBanService } from './steelhead-players-ban.service';

/** Defines the mock for the SteelheadPlayersBanService. */
@Injectable()
export class MockSteelheadPlayersBanService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getBanConfigurations$ = jasmine.createSpy('getBanConfigurations').and.returnValue(of([]));
  public getBanReasonGroups$ = jasmine.createSpy('getBanReasonGroups').and.returnValue(of([]));
  public postBanPlayers$ = jasmine.createSpy('postBanPlayers').and.returnValue(of());
  public postBanPlayersWithBackgroundProcessing$ = jasmine
    .createSpy('postBanPlayersWithBackgroundProcessing')
    .and.returnValue(of());
}
/** Creates an injectable mock for Steelhead Players Ban Service. */
export function createMockSteelheadPlayersBanService(): Provider {
  return {
    provide: SteelheadPlayersBanService,
    useValue: new MockSteelheadPlayersBanService(),
  };
}
