import BigNumber from 'bignumber.js';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitle } from '@models/enums';
import { SteelheadUserFlags, SteelheadUserFlagsInput } from '@models/steelhead';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { OldPermissionsService } from '@services/old-permissions';
import { SteelheadPlayerFlagsService } from '@services/api-v2/steelhead/player/flags/steelhead-player-flags.service';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  selector: 'steelhead-user-flags',
  templateUrl: '../user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class SteelheadUserFlagsComponent
  extends UserFlagsBaseComponent<SteelheadUserFlags>
  implements OnInit
{
  public gameTitle = GameTitle.FM8;

  public formControls = {
    isGamecoreVip: new UntypedFormControl(false),
    isGamecoreUltimateVip: new UntypedFormControl(false),
    isSteamVip: new UntypedFormControl(false),
    isSteamUltimateVip: new UntypedFormControl(false),
    isTurn10Employee: new UntypedFormControl(false),
    isEarlyAccess: new UntypedFormControl(false),
    isRaceMarshall: new UntypedFormControl(false),
    isCommunityManager: new UntypedFormControl(false),
    isContentCreator: new UntypedFormControl(false),
    isUnderReview: new UntypedFormControl(false), // Keep as last form control
  };

  public formGroup = new UntypedFormGroup(this.formControls);

  constructor(
    private readonly steelheadPlayerFlagsService: SteelheadPlayerFlagsService,
    permissionsService: OldPermissionsService,
  ) {
    super(permissionsService);
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // If Ultimate VIP is checked, VIP has to be checked also.
    this.formControls.isGamecoreUltimateVip.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.formControls.isGamecoreVip.setValue(true);
        this.formControls.isGamecoreVip.disable();
      } else {
        this.formControls.isGamecoreVip.enable();
      }
    });
    this.formControls.isSteamUltimateVip.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.formControls.isSteamVip.setValue(true);
        this.formControls.isSteamVip.disable();
      } else {
        this.formControls.isSteamVip.enable();
      }
    });
  }

  /** Gets Steelhead user flags. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<SteelheadUserFlags> {
    return this.steelheadPlayerFlagsService.getFlagsByXuid$(xuid);
  }

  /** Sets the newly selected Steelhead flags. */
  public putFlagsByXuid$(xuid: BigNumber): Observable<SteelheadUserFlags> {
    const x = {
      isGamecoreVip: this.formControls.isGamecoreVip.value,
      isGamecoreUltimateVip: this.formControls.isGamecoreUltimateVip.value,
      isSteamVip: this.formControls.isSteamVip.value,
      isSteamUltimateVip: this.formControls.isSteamUltimateVip.value,
      isTurn10Employee: this.formControls.isTurn10Employee.value,
      isEarlyAccess: this.formControls.isEarlyAccess.value,
      isUnderReview: this.formControls.isUnderReview.value,
      isRaceMarshall: this.formControls.isRaceMarshall.value,
      isCommunityManager: this.formControls.isCommunityManager.value,
      isContentCreator: this.formControls.isContentCreator.value,
    } as SteelheadUserFlagsInput;

    return this.steelheadPlayerFlagsService.putFlagsByXuid$(xuid, x);
  }
}
