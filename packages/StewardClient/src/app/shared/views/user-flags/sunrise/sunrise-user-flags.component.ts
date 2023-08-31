import BigNumber from 'bignumber.js';
import { Component, OnInit } from '@angular/core';
import { SunriseUserFlags } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitle } from '@models/enums';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { OldPermissionsService } from '@services/old-permissions';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  selector: 'sunrise-user-flags',
  templateUrl: '../user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class SunriseUserFlagsComponent
  extends UserFlagsBaseComponent<SunriseUserFlags>
  implements OnInit
{
  public gameTitle = GameTitle.FH4;

  public formControls = {
    isVip: new UntypedFormControl(false),
    isUltimateVip: new UntypedFormControl(false),
    isTurn10Employee: new UntypedFormControl(false),
    isEarlyAccess: new UntypedFormControl(false),
    needsStatisticsRepaired: new UntypedFormControl(false),
    isUnderReview: new UntypedFormControl(false),
  };

  public formGroup = new UntypedFormGroup(this.formControls);

  constructor(
    private readonly sunriseService: SunriseService,
    permissionsService: OldPermissionsService,
  ) {
    super(permissionsService);
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // If Ultimate VIP is checked, VIP has to be checked also.
    this.formControls.isUltimateVip.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.formControls.isVip.setValue(true);
        this.formControls.isVip.disable();
      } else {
        this.formControls.isVip.enable();
      }
    });
  }

  /** Gets Sunrise user flags. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<SunriseUserFlags> {
    return this.sunriseService.getFlagsByXuid$(xuid);
  }

  /** Sets the newly selected Sunrise flags. */
  public putFlagsByXuid$(xuid: BigNumber): Observable<SunriseUserFlags> {
    return this.sunriseService.putFlagsByXuid$(xuid, {
      isVip: this.formControls.isVip.value,
      isUltimateVip: this.formControls.isUltimateVip.value,
      isTurn10Employee: this.formControls.isTurn10Employee.value,
      isEarlyAccess: this.formControls.isEarlyAccess.value,
      needsStatisticsRepaired: this.formControls.needsStatisticsRepaired.value,
      isUnderReview: this.formControls.isUnderReview.value,
    } as SunriseUserFlags);
  }
}
