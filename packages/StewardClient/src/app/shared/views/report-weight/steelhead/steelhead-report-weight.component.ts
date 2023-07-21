import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPlayerReportWeightService } from '@services/api-v2/steelhead/player/report-weight/steelhead-report-weight.service';
import { ReportWeightServiceContract } from '../report-weight.component';
import { cloneDeep } from 'lodash';

/**
 *  Steelhead report weight component.
 */
@Component({
  selector: 'steelhead-report-weight',
  templateUrl: './steelhead-report-weight.component.html',
})
export class SteelheadReportWeightComponent {
  /** REVIEW-COMMENT: Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: ReportWeightServiceContract;

  constructor(steelheadPlayerReportWeightService: SteelheadPlayerReportWeightService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getUserReportWeight$: xuid => steelheadPlayerReportWeightService.getUserReportWeight$(xuid),
      setUserReportWeight$: (xuid, reportWeight) =>
        steelheadPlayerReportWeightService.setUserReportWeight$(xuid, reportWeight),
    };
  }

  /** Reloads the identity's report weight. */
  public reloadReportWeight(): void {
    // Fake identity change so ngOnChanges is fired
    this.identity = cloneDeep(this.identity);
  }
}
