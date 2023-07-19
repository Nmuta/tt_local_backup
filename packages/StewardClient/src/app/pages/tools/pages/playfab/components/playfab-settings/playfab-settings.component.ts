import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { PlayFabSettings } from '@models/blob-storage';
import { BlobStorageService } from '@services/blob-storage';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { SettingsService } from '@services/settings/settings';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BigNumberValidators } from '@shared/validators/bignumber-validators';
import { takeUntil } from 'rxjs';

/** Displays the playfab settings management tool. */
@Component({
  selector: 'playfab-settings',
  templateUrl: './playfab-settings.component.html',
  styleUrls: ['./playfab-settings.component.scss'],
})
export class PlayFabSettingsComponent extends BaseComponent implements OnInit {
  public getSettingsMonitor = new ActionMonitor('GET PlayFab settings');
  public setSettingsMonitor = new ActionMonitor('POST PlayFab settings');

  public activeCannotBeValidator: ValidatorFn;
  public formControls = {
    maxBuildLocks: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
  };
  public formGroup = new FormGroup(this.formControls);

  public permAttribute = PermAttributeName.ManagePlayFabSettings;

  public get buildLocksMaxError(): ValidationErrors {
    return this.formControls?.maxBuildLocks?.errors?.max;
  }

  public get buildLocksMinError(): ValidationErrors {
    return this.formControls?.maxBuildLocks?.errors?.min;
  }

  constructor(
    private readonly blobStorageService: BlobStorageService,
    private readonly settingsService: SettingsService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.blobStorageService
      .getPlayFabSettings$()
      .pipe(this.getSettingsMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(settings => {
        this.formControls.maxBuildLocks.setValue(settings.maxBuildLocks);
        this.setCannotBeValidator(settings);
      });
  }

  /** Saves the updated settings */
  public saveSettings(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.setSettingsMonitor = this.setSettingsMonitor.repeat();
    this.settingsService
      .setPlayFabSettings$(this.formGroup.value)
      .pipe(this.setSettingsMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(settings => {
        this.setCannotBeValidator(settings);
      });
  }

  private setCannotBeValidator(settings: PlayFabSettings) {
    if (!!this.activeCannotBeValidator) {
      this.formControls.maxBuildLocks.removeValidators(this.activeCannotBeValidator);
    }

    this.activeCannotBeValidator = BigNumberValidators.cannotBe([settings.maxBuildLocks]);
    this.formControls.maxBuildLocks.addValidators(this.activeCannotBeValidator);

    this.formControls.maxBuildLocks.updateValueAndValidity();
  }
}
