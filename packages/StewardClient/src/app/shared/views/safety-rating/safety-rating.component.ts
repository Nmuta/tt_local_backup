import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { Observable, takeUntil } from 'rxjs';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { SafetyRating, SafetyRatingUpdate } from '@models/player-safety-rating.model';
import { MatCheckboxChange } from '@angular/material/checkbox';

/** Safety Rating service contract. */
export interface SafetyRatingServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  getSafetyRating$(xuid: BigNumber): Observable<SafetyRating>;
  setSafetyRating$(xuid: BigNumber, safetyRating: SafetyRatingUpdate): Observable<SafetyRating>;
}

/** Component to get and set a player's safety rating. */
@Component({
  selector: 'safety-rating',
  templateUrl: './safety-rating.component.html',
  styleUrls: ['./safety-rating.component.scss'],
})
export class SafetyRatingComponent extends BaseComponent implements OnChanges {
  /** Driver level service contrtact. */
  @Input() service: SafetyRatingServiceContract;
  /** Player xuid. */
  @Input() xuid: BigNumber;

  public formControls = {
    safetyRatingScore: new UntypedFormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
    probationarySafetyRatingScore: new UntypedFormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
    isInProbation: new UntypedFormControl(false),
    grade: new UntypedFormControl({ value: null, disabled: true }),
  };

  public safetyRating: SafetyRating;
  public formGroup = new UntypedFormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get safety rating');

  public postMonitor = new ActionMonitor('Update safety rating');

  public permAttribute = PermAttributeName.UpdateSafetyRating;

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  constructor() {
    super();
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<SafetyRatingComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for safety rating component.');
    }

    if (!!changes.xuid) {
      this.getMonitor = this.getMonitor.repeat();

      this.service
        .getSafetyRating$(this.xuid)
        .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(safetyRating => {
          this.setupSafetyRating(safetyRating);
        });
    }
  }

  /** Sets a user's safety rating. */
  public setSafetyRating(): void {
    this.postMonitor = this.postMonitor.repeat();
    const inProbation = this.formControls.isInProbation.value;
    const score = inProbation
      ? this.formControls.probationarySafetyRatingScore.value
      : this.formControls.safetyRatingScore.value;

    const safetyRatingUpdate = {
      isInProbationaryPeriod: inProbation,
      score: score,
    };

    this.service
      .setSafetyRating$(this.xuid, safetyRatingUpdate)
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(newRating => {
        this.setupSafetyRating(newRating);
      });
  }

  /** Event when ban override checkbox is toggled. */
  public onInProbationChange(value: MatCheckboxChange): void {
    if (value.checked) {
      this.formControls.safetyRatingScore.disable();
      this.formControls.probationarySafetyRatingScore.enable();
    } else {
      this.formControls.safetyRatingScore.enable();
      this.formControls.probationarySafetyRatingScore.disable();
    }
  }

  private setupSafetyRating(safetyRating: SafetyRating) {
    this.safetyRating = safetyRating;
    this.formControls.safetyRatingScore.setValue(safetyRating.score);
    this.formControls.probationarySafetyRatingScore.setValue(
      safetyRating.probationaryScoreEstimate,
    );
    this.formControls.isInProbation.setValue(safetyRating.isInProbationaryPeriod);
    this.formControls.grade.setValue(safetyRating.grade);

    this.formControls.isInProbation.value
      ? this.formControls.safetyRatingScore.disable()
      : this.formControls.probationarySafetyRatingScore.disable();
  }
}
