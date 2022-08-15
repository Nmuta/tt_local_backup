import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPlayerReportWeightService } from '@services/api-v2/steelhead/player/report-weight/steelhead-report-weight.service';
import { ReportWeightServiceContract } from '../report-weight.component';

/**
 *  Steelhead report weight component.
 */
@Component({
  selector: 'steelhead-report-weight',
  templateUrl: './steelhead-report-weight.component.html',
})
export class SteelheadReportWeightComponent {
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
}
