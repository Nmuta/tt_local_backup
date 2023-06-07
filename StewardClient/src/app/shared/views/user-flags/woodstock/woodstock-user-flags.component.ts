import BigNumber from 'bignumber.js';
import { Component, OnInit } from '@angular/core';
import { WoodstockUserFlags } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitle } from '@models/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { OldPermissionsService } from '@services/old-permissions';

/** Retreives and displays Woodstock User Flags by XUID. */
@Component({
  selector: 'woodstock-user-flags',
  templateUrl: '../user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class WoodstockUserFlagsComponent
  extends UserFlagsBaseComponent<WoodstockUserFlags>
  implements OnInit
{
  public gameTitle = GameTitle.FH5;

  public formControls = {
    isVip: new FormControl(false),
    isUltimateVip: new FormControl(false),
    isTurn10Employee: new FormControl(false),
    isEarlyAccess: new FormControl(false),
    isRaceMarshall: new FormControl(false),
    isCommunityManager: new FormControl(false),
    isContentCreator: new FormControl(false),
    isUnderReview: new FormControl(false), // Keep as last form control
  };

  public formGroup = new FormGroup(this.formControls);

  constructor(
    private readonly woodstockService: WoodstockService,
    permissionsService: OldPermissionsService,
  ) {
    super(permissionsService);
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // Community Manager in FH5 has additional feature to modertate community challenges through liking and disliking content.
    // We need to add that text to the alternate label
    const unbannabledSearchText = 'Unbannable';
    const unbannableIndex = this.alteredLabels.isCommunityManager.indexOf(unbannabledSearchText);
    if (unbannableIndex >= 0) {
      const startString = this.alteredLabels.isCommunityManager.substring(
        0,
        unbannableIndex + unbannabledSearchText.length,
      );
      const endString = this.alteredLabels.isCommunityManager.substring(
        unbannableIndex + unbannabledSearchText.length,
        this.alteredLabels.isCommunityManager.length,
      );
      this.alteredLabels.isCommunityManager = `${startString} + Community Challenge Moderation${endString}`;
    }
  }

  /** Gets Woodstock user flags. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<WoodstockUserFlags> {
    return this.woodstockService.getFlagsByXuid$(xuid);
  }

  /** Sets the newly selected Woodstock flags. */
  public putFlagsByXuid$(xuid: BigNumber): Observable<WoodstockUserFlags> {
    return this.woodstockService.putFlagsByXuid$(xuid, {
      isVip: this.formControls.isVip.value,
      isUltimateVip: this.formControls.isUltimateVip.value,
      isTurn10Employee: this.formControls.isTurn10Employee.value,
      isEarlyAccess: this.formControls.isEarlyAccess.value,
      isUnderReview: this.formControls.isUnderReview.value,
      isRaceMarshall: this.formControls.isRaceMarshall.value,
      isCommunityManager: this.formControls.isCommunityManager.value,
      isContentCreator: this.formControls.isContentCreator.value,
    } as WoodstockUserFlags);
  }
}
