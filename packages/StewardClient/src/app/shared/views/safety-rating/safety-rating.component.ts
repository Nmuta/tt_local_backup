import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { Observable, takeUntil } from 'rxjs';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { SafetyRating, SafetyRatingUpdate } from '@models/player-safety-rating.model';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';

/** Safety Rating service contract. */
export interface SafetyRatingServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  getSafetyRating$(xuid: BigNumber): Observable<SafetyRating>;
  setSafetyRating$(xuid: BigNumber, safetyRating: SafetyRatingUpdate): Observable<SafetyRating>;
  deleteSafetyRating$(xuid: BigNumber): Observable<SafetyRating>;
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
    safetyRatingScore: new UntypedFormControl('', [Validators.required]),
    probationarySafetyRatingScore: new UntypedFormControl('', [Validators.required]),
    isInProbation: new UntypedFormControl(false),
    grade: new UntypedFormControl({ value: null, disabled: true }),
  };

  public manualFormControls = {
    score0: new UntypedFormControl(''),
    score1: new UntypedFormControl(''),
    score2: new UntypedFormControl(''),
    score3: new UntypedFormControl(''),
    score4: new UntypedFormControl(''),
    score5: new UntypedFormControl(''),
    score6: new UntypedFormControl(''),
    score7: new UntypedFormControl(''),
    score8: new UntypedFormControl(''),
    score9: new UntypedFormControl(''),
  }

  public safetyRating: SafetyRating;
  public formGroup = new UntypedFormGroup(this.formControls);
  public manualFormGroup = new UntypedFormGroup(this.manualFormControls);

  public getMonitor = new ActionMonitor('Get safety rating');

  public postMonitor = new ActionMonitor('Update safety rating');

  public deleteMonitor = new ActionMonitor('Clear safety rating');

  public permAttribute = PermAttributeName.UpdateSafetyRating;

  public minimumScoreValue: number;
  public maximumScoreValue: number;
  public probationRaceCount: number;
  public valueUnderMin: boolean = false;
  public valueOverMax: boolean = false;
  public displayCount: number = 0;
  private displayCountMax = 9;

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

    this.manualFormGroup.valueChanges.subscribe(_ => {
      this.computeChanges();
    })

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

  /** Increments display count. */
  public incrementDisplayCount(): void {
    if(this.displayCount >= this.displayCountMax)
    {
      return;
    }

    this.displayCount = this.displayCount + 1;
    console.log(this.displayCount);
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

  /** Clears a user's safety rating. */
  public clearSafetyRating(): void {
    this.deleteMonitor = this.deleteMonitor.repeat();

    this.service
      .deleteSafetyRating$(this.xuid)
      .pipe(this.deleteMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
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

  private computeChanges(): void {
    this.valueUnderMin = false;
    this.valueOverMax = false;

    Object.keys(this.manualFormGroup.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.manualFormGroup.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          if(keyError === 'min')
          {
            this.valueUnderMin = true;
          }

          if(keyError === 'max')
          {
            this.valueOverMax = true;
          }
        });
      }
    });
  }

  private setupSafetyRating(safetyRating: SafetyRating) {
    this.safetyRating = safetyRating;
    this.probationRaceCount = safetyRating.configuration.probationRaceCount.toNumber();
    this.minimumScoreValue = safetyRating.configuration.minScore.toNumber();
    this.maximumScoreValue = safetyRating.configuration.maxScore.toNumber();

    this.formControls.safetyRatingScore.setValue(safetyRating.score);
    this.formControls.probationarySafetyRatingScore.setValue(
      safetyRating.probationaryScoreEstimate,
    );
    this.formControls.isInProbation.setValue(safetyRating.isInProbationaryPeriod);
    this.formControls.grade.setValue(safetyRating.grade);

    if (safetyRating.configuration.probationRaceCount.isLessThanOrEqualTo(1)) {
      this.formControls.isInProbation.setValue(false);
      this.formControls.isInProbation.disable();
      this.formControls.probationarySafetyRatingScore.disable();
      this.formControls.probationarySafetyRatingScore.setValue(false);
    } else {
      this.formControls.isInProbation.value
        ? this.formControls.safetyRatingScore.disable()
        : this.formControls.probationarySafetyRatingScore.disable();
    }

    this.formControls.probationarySafetyRatingScore.addValidators([
      Validators.min(safetyRating.configuration.minScore.toNumber()),
      Validators.max(safetyRating.configuration.maxScore.toNumber()),
    ]);

    this.formControls.safetyRatingScore.addValidators([
      Validators.min(safetyRating.configuration.minScore.toNumber()),
      Validators.max(safetyRating.configuration.maxScore.toNumber()),
    ]);

    Object.keys(this.manualFormControls).forEach(key => {
      const control = this.manualFormControls[key];
      control.addValidators([
        Validators.min(safetyRating.configuration.minScore.toNumber()),
        Validators.max(safetyRating.configuration.maxScore.toNumber()),
      ]);
    });
  }
}
