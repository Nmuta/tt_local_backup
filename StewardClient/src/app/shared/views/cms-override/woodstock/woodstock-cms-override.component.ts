import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerCmsOverride } from '@models/player-cms-override.model';
import { WoodstockPlayerCmsOverrideService } from '@services/api-v2/woodstock/player/cms-override/woodstock-player-cms-override.service';
import BigNumber from 'bignumber.js';
import { CmsOverrideServiceContract } from '../cms-override.component';

/**
 *  Woodstock cms override component.
 */
@Component({
  selector: 'woodstock-cms-override',
  templateUrl: './woodstock-cms-override.component.html',
})
export class WoodstockCmsOverrideComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: CmsOverrideServiceContract;

  constructor(woodstockPlayerCmsOverrideService: WoodstockPlayerCmsOverrideService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getUserCmsOverride$: xuid => woodstockPlayerCmsOverrideService.getCmsOverrideByXuid$(xuid),
      setUserCmsOverride$: (xuid: BigNumber, cmsOverride: PlayerCmsOverride) =>
        woodstockPlayerCmsOverrideService.setCmsOverrideByXuid$(xuid, cmsOverride),
      deleteUserCmsOverride$: (xuid: BigNumber) =>
        woodstockPlayerCmsOverrideService.deleteCmsOverrideByXuid$(xuid),
    };
  }
}
