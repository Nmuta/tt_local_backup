import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerCmsOverride } from '@models/player-cms-override.model';
import { SteelheadPlayerCmsOverrideService } from '@services/api-v2/steelhead/player/cms-override/steelhead-player-cms-override.service';
import BigNumber from 'bignumber.js';
import { CmsOverrideServiceContract } from '../cms-override.component';

/**
 *  Steelhead cms override component.
 */
@Component({
  selector: 'steelhead-cms-override',
  templateUrl: './steelhead-cms-override.component.html',
})
export class SteelheadCmsOverrideComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: CmsOverrideServiceContract;

  constructor(steelheadPlayerCmsOverrideService: SteelheadPlayerCmsOverrideService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getUserCmsOverride$: xuid => steelheadPlayerCmsOverrideService.getCmsOverrideByXuid$(xuid),
      setUserCmsOverride$: (xuid: BigNumber, cmsOverride: PlayerCmsOverride) =>
        steelheadPlayerCmsOverrideService.setCmsOverrideByXuid$(xuid, cmsOverride),
      deleteUserCmsOverride$: (xuid: BigNumber) =>
        steelheadPlayerCmsOverrideService.deleteCmsOverrideByXuid$(xuid),
    };
  }
}
