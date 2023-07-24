import BigNumber from 'bignumber.js';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitle } from '@models/enums';
import { SteelheadUserFlags } from '@models/steelhead';
import { FormControl, FormGroup } from '@angular/forms';
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
    isGamecoreVip: new FormControl(false),
    isGamecoreUltimateVip: new FormControl(false),
    isSteamVip: new FormControl(false),
    isSteamUltimateVip: new FormControl(false),
    isTurn10Employee: new FormControl(false),
    isEarlyAccess: new FormControl(false),
    isRaceMarshall: new FormControl(false),
    isCommunityManager: new FormControl(false),
    isContentCreator: new FormControl(false),
    isUnderReview: new FormControl(false), // Keep as last form control
  };

  public formGroup = new FormGroup(this.formControls);

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
    return this.steelheadPlayerFlagsService.putFlagsByXuid$(xuid, {
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
    } as SteelheadUserFlags);
  }
}
