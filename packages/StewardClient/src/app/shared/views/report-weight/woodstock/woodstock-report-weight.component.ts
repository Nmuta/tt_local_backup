import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockPlayerService } from '@services/api-v2/woodstock/player/woodstock-player.service';
import { ReportWeightServiceContract } from '../report-weight.component';
import { cloneDeep } from 'lodash';

/**
 *  Woodstock report weight component.
 */
@Component({
  selector: 'woodstock-report-weight',
  templateUrl: './woodstock-report-weight.component.html',
})
export class WoodstockReportWeightComponent {
  /** REVIEW-COMMENT: Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: ReportWeightServiceContract;

  constructor(woodstockPlayerService: WoodstockPlayerService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getUserReportWeight$: xuid => woodstockPlayerService.getUserReportWeight$(xuid),
      setUserReportWeight$: (xuid, reportWeight) =>
        woodstockPlayerService.setUserReportWeight$(xuid, reportWeight),
    };
  }

  /** Reloads the identity's report weight. */
  public reloadReportWeight(): void {
    // Fake identity change so ngOnChanges is fired
    this.identity = cloneDeep(this.identity);
  }
}
