import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitleCodeName } from '@models/enums';
import { SteelheadService } from '@services/steelhead';
import { SteelheadUserFlags } from '@models/steelhead';
import { FormControl, FormGroup } from '@angular/forms';
import { PermissionsService } from '@services/permissions';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  selector: 'steelhead-user-flags',
  templateUrl: '../user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class SteelheadUserFlagsComponent extends UserFlagsBaseComponent<SteelheadUserFlags> {
  public gameTitle = GameTitleCodeName.FM7;

  public formControls = {
    isVip: new FormControl(false),
    isTurn10Employee: new FormControl(false),
    isEarlyAccess: new FormControl(false),
    isUnderReview: new FormControl(false),
  };

  public formGroup = new FormGroup(this.formControls);

  constructor(
    private readonly steelheadService: SteelheadService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets Steelhead user flags. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<SteelheadUserFlags> {
    return this.steelheadService.getFlagsByXuid$(xuid);
  }

  /** Sets the newly selected Steelhead flags. */
  public putFlagsByXuid$(xuid: BigNumber): Observable<SteelheadUserFlags> {
    return this.steelheadService.putFlagsByXuid$(xuid, {
      isVip: this.formControls.isVip.value,
      isTurn10Employee: this.formControls.isTurn10Employee.value,
      isEarlyAccess: this.formControls.isEarlyAccess.value,
      isUnderReview: this.formControls.isUnderReview.value,
    } as SteelheadUserFlags);
  }
}
