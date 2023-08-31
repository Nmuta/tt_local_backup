import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { PlayFabSettings } from '@models/blob-storage';
import { GameTitle } from '@models/enums';
import { BlobStorageService } from '@services/blob-storage';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { SettingsService } from '@services/settings/settings';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BigNumberValidators } from '@shared/validators/bignumber-validators';
import { cloneDeep } from 'lodash';
import { takeUntil } from 'rxjs';

/** Displays the playfab settings management tool. */
@Component({
  selector: 'playfab-settings',
  templateUrl: './playfab-settings.component.html',
  styleUrls: ['./playfab-settings.component.scss'],
})
export class PlayFabSettingsComponent extends BaseComponent implements OnInit {
  /** Game Title to manage Playfab settings for. */
  @Input() public title: GameTitle;

  public getSettingsMonitor = new ActionMonitor('GET PlayFab settings');
  public setSettingsMonitor = new ActionMonitor('POST PlayFab settings');

  public activeCannotBeValidator: ValidatorFn;
  public formControls = {
    maxBuildLocks: new UntypedFormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
  };
  public formGroup = new UntypedFormGroup(this.formControls);

  public permAttribute = PermAttributeName.ManagePlayFabSettings;

  public get buildLocksMaxError(): ValidationErrors {
    return this.formControls?.maxBuildLocks?.errors?.max;
  }

  public get buildLocksMinError(): ValidationErrors {
    return this.formControls?.maxBuildLocks?.errors?.min;
  }

  private validGameTitles = [GameTitle.FH5, GameTitle.Forte];

  constructor(
    private readonly blobStorageService: BlobStorageService,
    private readonly settingsService: SettingsService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.title) {
      throw Error('No title defined for Playfab Settings Component.');
    }

    if (!this.validGameTitles.includes(this.title)) {
      throw Error(`Title ${this.title} is not supported in Playfab Settings Component.`);
    }

    this.blobStorageService
      .getPlayFabSettings$()
      .pipe(this.getSettingsMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(settings => {
        this.settings = settings;

        switch (this.title) {
          case GameTitle.Forte: {
            this.formControls.maxBuildLocks.setValue(settings.forteMaxBuildLocks);
            break;
          }
          case GameTitle.FH5: {
            this.formControls.maxBuildLocks.setValue(settings.woodstockMaxBuildLocks);
            break;
          }
          default: {
            throw new Error(`Cannot find maximum build lock value for ${this.title}`);
            break;
          }
        }

        this.setCannotBeValidator(settings);
      });
  }

  /** Saves the updated settings */
  public saveSettings(): void {
    if (!this.formGroup.valid) {
      return;
    }

    const newSettings = cloneDeep(this.settings);

    switch (this.title) {
      case GameTitle.Forte: {
        newSettings.forteMaxBuildLocks = this.formControls.maxBuildLocks.value;
        break;
      }
      case GameTitle.FH5: {
        newSettings.woodstockMaxBuildLocks = this.formControls.maxBuildLocks.value;
        break;
      }
      default: {
        throw new Error(`Cannot set maximum build lock value for ${this.title}`);
        break;
      }
    }

    this.setSettingsMonitor = this.setSettingsMonitor.repeat();
    this.settingsService
      .setPlayFabSettings$(newSettings)
      .pipe(this.setSettingsMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(settings => {
        this.setCannotBeValidator(settings);
      });
  }

  private setCannotBeValidator(settings: PlayFabSettings) {
    if (!!this.activeCannotBeValidator) {
      this.formControls.maxBuildLocks.removeValidators(this.activeCannotBeValidator);
    }

    switch (this.title) {
      case GameTitle.Forte: {
        this.activeCannotBeValidator = BigNumberValidators.cannotBe([settings.forteMaxBuildLocks]);
        break;
      }
      case GameTitle.FH5: {
        this.activeCannotBeValidator = BigNumberValidators.cannotBe([
          settings.woodstockMaxBuildLocks,
        ]);
        break;
      }
      default: {
        throw new Error(`Cannot find maximum build lock value for ${this.title}`);
        break;
      }
    }

    this.formControls.maxBuildLocks.addValidators(this.activeCannotBeValidator);

    this.formControls.maxBuildLocks.updateValueAndValidity();
  }
}
