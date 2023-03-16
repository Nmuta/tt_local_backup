import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockPlayersBanService } from './woodstock-players-ban.service';

/** Defines the mock for the WoodstockPlayersBanService. */
@Injectable()
export class MockWoodstockPlayersBanService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getBanConfigurations$ = jasmine.createSpy('getBanConfigurations').and.returnValue(of([]));
  public postBanPlayers$ = jasmine.createSpy('postBanPlayers').and.returnValue(of());
  public postBanPlayersWithBackgroundProcessing$ = jasmine
    .createSpy('postBanPlayersWithBackgroundProcessing')
    .and.returnValue(of());
}
/** Creates an injectable mock for Woodstock Players Ban Service. */
export function createMockWoodstockPlayersBanService(): Provider {
  return {
    provide: WoodstockPlayersBanService,
    useValue: new MockWoodstockPlayersBanService(),
  };
}
