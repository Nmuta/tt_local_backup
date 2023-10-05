import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { Observable, takeUntil } from 'rxjs';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { SafetyRating, SafetyRatingUpdate } from '@models/player-safety-rating.model';

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

  public formArray = new FormArray([]);
  public formGroup = new UntypedFormGroup({ scores: this.formArray });

  public safetyRating: SafetyRating;

  public getMonitor = new ActionMonitor('Get safety rating');
  public postMonitor = new ActionMonitor('Update safety rating');
  public deleteMonitor = new ActionMonitor('Clear safety rating');

  public permAttribute = PermAttributeName.UpdateSafetyRating;

  public minimumScoreValue: number;
  public maximumScoreValue: number;
  public probationRaceCount: number;
  public valueUnderMin: boolean = false;
  public valueOverMax: boolean = false;
  private displayCountMax = 10;

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

  /** Increments display count. */
  public incrementDisplayCount(): void {
    if(this.formArray.length === this.displayCountMax)
    {
      return;
    }

    const formControlAdd = new UntypedFormControl(0, [
      Validators.min(this.minimumScoreValue),
      Validators.max(this.maximumScoreValue),
    ]);

    formControlAdd.valueChanges.subscribe(_ => {
      this.computeChanges();
    });

    this.formArray.insert(this.formArray.length, formControlAdd);
    this.formArray.updateValueAndValidity();
  }

  /** Sets a user's safety rating. */
  public setSafetyRating(): void {
    // this.postMonitor = this.postMonitor.repeat();
    // const inProbation = this.formControls.isInProbation.value;
    // const score = inProbation
    //   ? this.formControls.probationarySafetyRatingScore.value
    //   : this.formControls.safetyRatingScore.value;

    // const safetyRatingUpdate = {
    //   isInProbationaryPeriod: inProbation,
    //   score: score,
    // };

    // this.service
    //   .setSafetyRating$(this.xuid, safetyRatingUpdate)
    //   .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
    //   .subscribe(newRating => {
    //     this.setupSafetyRating(newRating);
    //   });
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

  private computeChanges(): void {
    console.log('COMPUTE CHANGES TRIGGERED')
    this.valueUnderMin = false;
    this.valueOverMax = false;

    Object.keys(this.formArray.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.formArray.get(key).errors;
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

    const firstScoreControl = new UntypedFormControl(0, [
      Validators.min(safetyRating.configuration.minScore.toNumber()),
      Validators.max(safetyRating.configuration.maxScore.toNumber()),
    ])

    firstScoreControl.valueChanges.subscribe(_ => this.computeChanges())

    this.formArray.controls = [firstScoreControl];

    // Object.keys(this.formArray.controls).forEach(key => {
    //   const control = this.formArray.controls[key] as UntypedFormControl;

    //   control.setValidators([
    //     Validators.min(safetyRating.configuration.minScore.toNumber()),
    //     Validators.max(safetyRating.configuration.maxScore.toNumber()),
    //   ]);
    // });
  }
}
