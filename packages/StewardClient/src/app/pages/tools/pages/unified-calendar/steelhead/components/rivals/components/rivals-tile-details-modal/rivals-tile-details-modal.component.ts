import { Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { getLeaderboardsRoute } from '@helpers/route-links';
import { GameTitle } from '@models/enums';
import { RivalsEvent } from '@services/api-v2/steelhead/rivals/steelhead-rivals.service';

export type RivalsEventWithEnvironment = RivalsEvent & {
  leaderboardEnvironmnet: string;
};

/** Modal component to display a rivals event. */
@Component({
  templateUrl: './rivals-tile-details-modal.component.html',
  styleUrls: ['./rivals-tile-details-modal.component.scss'],
})
export class RivalsTileDetailsModalComponent extends BaseComponent {
  public routerLink;
  public queryParams;
  constructor(
    protected dialogRef: MatDialogRef<RivalsTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RivalsEventWithEnvironment,
  ) {
    super();

    const x = getLeaderboardsRoute(GameTitle.FM8);
    this.routerLink = x;
    this.queryParams = {
      leaderboardEnvironment: data.leaderboardEnvironmnet,
      scoreboardTypeId: 3, //Rivals is 3
      scoreTypeId: data.scoreTypeId.toNumber(),
      gameScoreboardId: data.id.toNumber(),
      trackId: data.trackId.toNumber(),
    };
  }
}
