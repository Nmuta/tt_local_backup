import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { Observable, takeUntil } from 'rxjs';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { GuidLikeString } from '@models/extended-types';
import { SkillRatingSummary } from '@services/api-v2/steelhead/player/skill-rating/steelhead-player-skill-rating.service';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';

/** Skill Rating service contract. */
export interface SkillRatingServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  getSkillRating$(xuid: BigNumber, profileId: GuidLikeString): Observable<SkillRatingSummary>;
  overrideSkillRating$(
    xuid: BigNumber,
    profileId: GuidLikeString,
    skillRating: BigNumber,
  ): Observable<SkillRatingSummary>;
  clearSkillRatingOverride$(
    xuid: BigNumber,
    profileId: GuidLikeString,
  ): Observable<SkillRatingSummary>;
}

/** Component to get and set a player's skill rating. */
@Component({
  selector: 'skill-rating',
  templateUrl: './skill-rating.component.html',
  styleUrls: ['./skill-rating.component.scss'],
})
export class SkillRatingComponent extends BaseComponent implements OnChanges {
  /** skill rating service contrtact. */
  @Input() service: SkillRatingServiceContract;
  /** Player xuid. */
  @Input() xuid: BigNumber;
  /** Player profile. */
  @Input() public profile: FullPlayerInventoryProfile;

  public isOverridden: boolean = false;
  public normalizedSkillRatingMin: BigNumber;
  public normalizedSkillRatingMax: BigNumber;

  public formControls = {
    normalizedSkillRating: new UntypedFormControl({ value: null, disabled: true }),
    rawSkillRating: new UntypedFormControl({ value: null, disabled: true }),
    skillRatingOverride: new UntypedFormControl({ value: null, disabled: false }),
  };

  public formGroup = new UntypedFormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get skill rating');
  public postMonitor = new ActionMonitor('Set skill rating override');
  public deleteMonitor = new ActionMonitor('Clear skill rating override');

  public permAttribute = PermAttributeName.OverrideSkillRating;

  /** A string overview of the profile ids. */
  public get profileOverviewString(): string {
    return `Profile Id: ${this.profile?.profileId} (External Id: ${
      this.profile?.externalProfileId
    }) Title Id: ${this.profile?.titleName} (${this.profile?.titleId?.toString(16)}))`;
  }

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  constructor() {
    super();
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<SkillRatingComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for skill rating component.');
    }

    if (!!this.xuid && !!this.profile?.externalProfileId) {
      this.getSkillRatingSummary();
    }
  }

  /** Gets skill rating summary. */
  public getSkillRatingSummary(): void {
    this.getMonitor = this.getMonitor.repeat();

    this.service
      .getSkillRating$(this.xuid, this.profile?.externalProfileId)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(skillRatingSummary => {
        this.prepareForm(skillRatingSummary);
      });
  }

  /** Sets skill rating override. */
  public setSkillRatingOverride(): void {
    this.postMonitor = this.postMonitor.repeat();

    this.service
      .overrideSkillRating$(
        this.xuid,
        this.profile?.externalProfileId,
        this.formControls.skillRatingOverride.value,
      )
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(skillRatingSummary => {
        this.prepareForm(skillRatingSummary);
      });
  }

  /** Clears skill rating override. */
  public clearSkillRatingOverride(): void {
    this.deleteMonitor = this.deleteMonitor.repeat();

    this.service
      .clearSkillRatingOverride$(this.xuid, this.profile?.externalProfileId)
      .pipe(this.deleteMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(skillRatingSummary => {
        this.prepareForm(skillRatingSummary);
      });
  }

  private prepareForm(summary: SkillRatingSummary) {
    this.isOverridden = summary.isScoreOverridden;

    this.formControls.rawSkillRating.setValue(summary.rawMean);
    this.formControls.normalizedSkillRating.setValue(summary.normalizedMean);

    const skillOverrideValue =
      summary.overriddenScore.toNumber() == 0 ? null : summary.overriddenScore;
    this.formControls.skillRatingOverride.setValue(skillOverrideValue);

    this.formControls.skillRatingOverride.clearValidators();
    this.normalizedSkillRatingMin = summary.normalizationMin;
    this.normalizedSkillRatingMax = summary.normalizationMax;

    this.formControls.skillRatingOverride.addValidators([
      Validators.min(this.normalizedSkillRatingMin.toNumber()),
      Validators.max(this.normalizedSkillRatingMax.toNumber()),
    ]);
  }
}
