import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { hasV1AccessToV1RestrictedFeature, V1RestrictedFeature } from '@environments/environment';
import { ForzaSandbox, GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { ResetProfileOptions } from '@models/reset-profile-options';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UserState } from '@shared/state/user/user.state';
import BigNumber from 'bignumber.js';
import { catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

/** Required params for player profile management. */
export interface PlayerProfileManagementServiceContract {
  gameTitle: GameTitle;
  employeeGroupId: BigNumber;
  getUserGroupMembership$: (groupId: BigNumber, xuid: BigNumber) => Observable<boolean>;
  getPlayerProfileTemplates$: () => Observable<string[]>;
  savePlayerProfileTemplate$: (
    xuid: BigNumber,
    profileId: GuidLikeString,
    templateName: string,
    overwriteIfExists: boolean,
  ) => Observable<void>;
  loadTemplateToPlayerProfile$: (
    xuid: BigNumber,
    profileId: GuidLikeString,
    templateName: string,
    continueOnBreakingChanges: boolean,
    forzaSandbox: ForzaSandbox,
  ) => Observable<GuidLikeString>;
  resetPlayerProfile$: (
    xuid: BigNumber,
    profileId: GuidLikeString,
    options: ResetProfileOptions,
  ) => Observable<GuidLikeString>;
}

/** Component for displaying user endpoint selections. */
@Component({
  selector: 'player-profile-management',
  templateUrl: './player-profile-management.component.html',
  styleUrls: ['./player-profile-management.component.scss'],
})
export class PlayerProfileManagementComponent extends BaseComponent implements OnInit, OnChanges {
  /** Player xuid. */
  @Input() public xuid: BigNumber;
  /** External profile id. */
  @Input() public externalProfileId: GuidLikeString;
  /** The player profile management service. */
  @Input() public service: PlayerProfileManagementServiceContract;
  /**  Output when profile id is updated. */
  @Output() public externalProfileIdUpdated = new EventEmitter<GuidLikeString>();

  private readonly getGroupMembership$ = new Subject<void>();

  public hasAccessToTool: boolean = false;

  public getGroupMembershipMonitor = new ActionMonitor('Get group membership');
  public getTemplatesMonitor = new ActionMonitor('Get profile templates');
  public saveTemplateMonitor = new ActionMonitor('Save profile template');
  public loadTemplateMonitor = new ActionMonitor('Load profile template');
  public resetTemplateMonitor = new ActionMonitor('Reset profile');

  public profileTemplates: string[] = [];

  public playerConsentText: string = 'I have received player consent for this action';

  public forzaSandboxEnumDefault: string[] = [ForzaSandbox.Retail];
  public forzaSandboxEnumEmployee: string[] = [ForzaSandbox.Retail, ForzaSandbox.Test];
  public forzaSandboxEnum: string[] = this.forzaSandboxEnumDefault;

  public saveFormDefaults = {
    verifyAction: false,
    template: '',
    overwriteIfExists: false,
  };
  public saveFormControls = {
    verifyAction: new FormControl(this.saveFormDefaults.verifyAction, Validators.requiredTrue),
    template: new FormControl(this.saveFormDefaults.template, Validators.required),
    overwriteIfExists: new FormControl(
      this.saveFormDefaults.overwriteIfExists,
      Validators.required,
    ),
  };
  public saveFormGroup = new FormGroup(this.saveFormControls);

  public loadFormDefaults = {
    verifyAction: false,
    template: '',
    continueOnBreakingChanges: false,
    forzaSandbox: ForzaSandbox.Retail,
  };
  public loadFormControls = {
    verifyAction: new FormControl(this.loadFormDefaults.verifyAction, Validators.requiredTrue),
    template: new FormControl(this.loadFormDefaults.template, Validators.required),
    continueOnBreakingChanges: new FormControl(
      this.loadFormDefaults.continueOnBreakingChanges,
      Validators.required,
    ),
    forzaSandbox: new FormControl(this.loadFormDefaults.forzaSandbox, Validators.required),
  };
  public loadFormGroup = new FormGroup(this.loadFormControls);

  public resetFormDefaults = {
    verifyAction: false,
    resetCarProgressData: false,
    resetLeaderboardsData: false,
    resetRaceRankingData: false,
    resetStatsData: false,
    resetTrueSkillData: false,
    resetUserInventoryData: false,
    resetUserSafetyRatingData: false,
    resetUgcProfileData: false,
  };
  public resetFormControls = {
    verifyAction: new FormControl(this.resetFormDefaults.verifyAction, Validators.requiredTrue),
    resetCarProgressData: new FormControl(
      this.resetFormDefaults.resetCarProgressData,
      Validators.required,
    ),
    resetLeaderboardsData: new FormControl(
      this.resetFormDefaults.resetLeaderboardsData,
      Validators.required,
    ),
    resetRaceRankingData: new FormControl(
      this.resetFormDefaults.resetRaceRankingData,
      Validators.required,
    ),
    resetStatsData: new FormControl(this.resetFormDefaults.resetStatsData, Validators.required),
    resetTrueSkillData: new FormControl(
      this.resetFormDefaults.resetTrueSkillData,
      Validators.required,
    ),
    resetUserInventoryData: new FormControl(
      this.resetFormDefaults.resetUserInventoryData,
      Validators.required,
    ),
    resetUserSafetyRatingData: new FormControl(
      this.resetFormDefaults.resetUserSafetyRatingData,
      Validators.required,
    ),
    resetUgcProfileData: new FormControl(
      this.resetFormDefaults.resetUgcProfileData,
      Validators.required,
    ),
  };
  public resetFormGroup = new FormGroup(this.resetFormControls);

  /** Boolean if both XUID and Profile Id inputs are valid. */
  public get hasXuidAndProfileId(): boolean {
    return !!this.xuid || !!this.externalProfileId;
  }

  constructor(private readonly store: Store) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.hasAccessToTool = hasV1AccessToV1RestrictedFeature(
      V1RestrictedFeature.PlayerProfileManagement,
      this.service.gameTitle,
      user.role,
    );

    this.service
      .getPlayerProfileTemplates$()
      .pipe(this.getTemplatesMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(templates => {
        this.profileTemplates = templates;
      });

    this.getGroupMembership$
      .pipe(
        tap(() => (this.getGroupMembershipMonitor = this.getGroupMembershipMonitor.repeat())),
        switchMap(() => {
          return this.service.getUserGroupMembership$(this.service.employeeGroupId, this.xuid).pipe(
            this.getGroupMembershipMonitor.monitorSingleFire(),
            catchError(() => {
              return EMPTY;
            }),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(isEmployee => {
        if (isEmployee) {
          this.forzaSandboxEnum = this.forzaSandboxEnumEmployee;
        } else {
          this.forzaSandboxEnum = this.forzaSandboxEnumDefault;
        }
      });

    this.getGroupMembership$.next();
  }

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.service) {
      throw new Error('No service contract provided for PlayerProfileManagementComponent');
    }
  }

  /** Reverifies user group membership. */
  public checkUserGroupMembership(): void {
    this.getGroupMembership$.next();
  }

  /** Saves the profile to the template. */
  public saveProfileToTemplate(): void {
    if (!this.hasAccessToTool || !this.hasXuidAndProfileId || !this.saveFormGroup.valid) {
      return;
    }

    this.saveTemplateMonitor = this.saveTemplateMonitor.repeat();
    this.service
      .savePlayerProfileTemplate$(
        this.xuid,
        this.externalProfileId,
        this.saveFormControls.template.value,
        this.saveFormControls.overwriteIfExists.value,
      )
      .pipe(this.saveTemplateMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.saveFormGroup.reset(this.saveFormDefaults);
      });
  }

  /** Saves the profile to the template. */
  public loadTemplateToProfile(): void {
    if (!this.hasAccessToTool || !this.hasXuidAndProfileId || !this.loadFormGroup.valid) {
      return;
    }

    this.loadTemplateMonitor = this.loadTemplateMonitor.repeat();
    this.service
      .loadTemplateToPlayerProfile$(
        this.xuid,
        this.externalProfileId,
        this.loadFormControls.template.value,
        this.loadFormControls.continueOnBreakingChanges.value,
        this.loadFormControls.forzaSandbox.value,
      )
      .pipe(this.loadTemplateMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(updatedProfileId => {
        this.loadFormGroup.reset(this.loadFormDefaults);
        this.externalProfileIdUpdated.emit(updatedProfileId);
      });
  }

  /** Saves the profile to the template. */
  public resetProfile(): void {
    if (!this.hasAccessToTool || !this.hasXuidAndProfileId || !this.resetFormGroup.valid) {
      return;
    }

    this.resetTemplateMonitor = this.resetTemplateMonitor.repeat();
    this.service
      .resetPlayerProfile$(this.xuid, this.externalProfileId, {
        resetCarProgressData: this.resetFormControls.resetCarProgressData.value,
        resetLeaderboardsData: this.resetFormControls.resetLeaderboardsData.value,
        resetRaceRankingData: this.resetFormControls.resetRaceRankingData.value,
        resetStatsData: this.resetFormControls.resetStatsData.value,
        resetTrueSkillData: this.resetFormControls.resetTrueSkillData.value,
        resetUserInventoryData: this.resetFormControls.resetUserInventoryData.value,
        resetUserSafetyRatingData: this.resetFormControls.resetUserSafetyRatingData.value,
        resetUgcProfileData: this.resetFormControls.resetUgcProfileData.value,
      } as ResetProfileOptions)
      .pipe(this.resetTemplateMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(updatedProfileId => {
        this.resetFormGroup.reset(this.resetFormDefaults);
        this.externalProfileIdUpdated.emit(updatedProfileId);
      });
  }

  /** Sets all optional reset params to true. */
  public setAllResetOptionsToTrue(): void {
    this.resetFormControls.resetCarProgressData.setValue(true);
    this.resetFormControls.resetLeaderboardsData.setValue(true);
    this.resetFormControls.resetRaceRankingData.setValue(true);
    this.resetFormControls.resetStatsData.setValue(true);
    this.resetFormControls.resetTrueSkillData.setValue(true);
    this.resetFormControls.resetUserInventoryData.setValue(true);
    this.resetFormControls.resetUserSafetyRatingData.setValue(true);
    this.resetFormControls.resetUgcProfileData.setValue(true);
  }
}
