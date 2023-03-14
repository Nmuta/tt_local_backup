import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerDriverLevel } from '@models/player-driver-level.model';
import { SteelheadPlayerDriverLevelService } from '@services/api-v2/steelhead/player/driver-level/steelhead-player-driver-level.service';
import BigNumber from 'bignumber.js';
import { DriverLevelServiceContract } from '../driver-level.component';

/**
 *  Steelhead driver level component.
 */
@Component({
  selector: 'steelhead-driver-level',
  templateUrl: './steelhead-driver-level.component.html',
})
export class SteelheadDriverLevelComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: DriverLevelServiceContract;

  constructor(steelheadPlayerDriverLevelService: SteelheadPlayerDriverLevelService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getDriverLevel$: xuid => steelheadPlayerDriverLevelService.getDriverLevelByXuid$(xuid),
      setDriverLevel$: (xuid: BigNumber, driverLevel: PlayerDriverLevel) => steelheadPlayerDriverLevelService.setDriverLevelByXuid$(xuid, driverLevel)
    };
  }
}
