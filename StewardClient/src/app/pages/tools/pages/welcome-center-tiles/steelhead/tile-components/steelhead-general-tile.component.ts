import { Component, forwardRef } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { BetterFormArray } from '@helpers/better-form-array';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { GameTitle } from '@models/enums';
import { LocalizedStringsMap } from '@models/localization';
import {
  TimerReferenceInstance,
  TimerType,
  TimerInstance,
  WelcomeCenterTile,
  WelcomeCenterTileSize,
  FriendlyNameMap,
} from '@models/welcome-center';
import { SteelheadBuildersCupService } from '@services/api-v2/steelhead/builders-cup/steelhead-builders-cup.service';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadRacersCupService } from '@services/api-v2/steelhead/racers-cup/steelhead-racers-cup.service';
import { SteelheadWorldOfForzaService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/world-of-forza/steelhead-world-of-forza.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DateTime } from 'luxon';
import { combineLatest, filter, map, Observable, pairwise, startWith, takeUntil } from 'rxjs';

/** Outputted form value of the base tile form. */
export type BaseTileFormValue = WelcomeCenterTile;

/** FormGroup extension for a display condition item. */
class DisplayConditionItemFormGroup extends FormGroup {
  get reference(): AbstractControl {
    return this.get('reference');
  }
  get when(): AbstractControl {
    return this.get('when');
  }
}

/** The base tile component. */
@Component({
  selector: 'steelhead-general-tile',
  templateUrl: './steelhead-general-tile.component.html',
  styleUrls: ['./steelhead-general-tile.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralTileComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GeneralTileComponent),
      multi: true,
    },
  ],
})
export class GeneralTileComponent extends BaseComponent {
  public gameTitle = GameTitle.FM8;
  public localizationSelectServiceContract: SelectLocalizedStringContract;
  public sizes: string[] = [WelcomeCenterTileSize.Large, WelcomeCenterTileSize.Medium];
  public getTimerReferenceMonitor = new ActionMonitor('GET Timer Reference Data');

  public timerInstanceEnum = TimerInstance;
  public timerTypeEnum = TimerType;
  public timerReferenceOptions: Map<string, string>;
  public ladderReferences: Map<string, string>;
  public seriesReferences: Map<string, string>;
  public displayConditionReferences: FriendlyNameMap;
  public whenFieldReferences: string[] = [
    '#builderscup',
    '#internal',
    '#dev',
    '#narrator',
    '#tts',
    '#automation',
    '#hqfirstpersonnav',
    '#prod',
    '#audio',
    '#cinematics',
    '#dayofplay',
    '#devtest',
    '#EventSelectRaceLength',
    '#integration-tests',
    '#liveteam',
    '#megafun',
    '#mixmaster',
    '#mpstresstesting',
    '#vanguard',
  ];
  public selectedTimerReferenceInstance: TimerReferenceInstance;
  // Min date is needed for datetime picker to not crash. We use epoch time
  public minDate = DateTime.fromSeconds(0);

  public formControls = {
    size: new FormControl(null, [Validators.required]),
    localizedTileTitle: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    localizedTileType: new FormControl({ value: {}, disabled: true }),
    localizedTileDescription: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    tileImagePath: new FormControl(null),
    timerInstance: new FormControl(),
    timerLocalizedStartTextOverride: new FormControl({ value: {}, disabled: true }),
    timerLocalizedEndTextOverride: new FormControl({ value: {}, disabled: true }),
    timerType: new FormControl(TimerType.ToStartOrToEnd),
    timerReferenceId: new FormControl(),
    timerCustomFromDate: new FormControl(),
    timerCustomToDate: new FormControl(),
    displayConditions: new BetterFormArray<DisplayConditionItemFormGroup>([]),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    steelheadWorldOfForzaService: SteelheadWorldOfForzaService,
    steelheadBuildersCupService: SteelheadBuildersCupService,
    steelheadRacersCupService: SteelheadRacersCupService,
  ) {
    super();

    steelheadWorldOfForzaService
      .getDisplayConditions$()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.displayConditionReferences = data;
      });

    this.localizationSelectServiceContract = {
      gameTitle: this.gameTitle,
      getLocalizedStrings$(): Observable<LocalizedStringsMap> {
        return steelheadLocalizationService.getLocalizedStrings$();
      },
    };

    this.formControls.timerInstance.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if (data == TimerInstance.Chapter) {
          this.selectedTimerReferenceInstance = TimerReferenceInstance.Chapter;
          // TODO: Get data from projection https://dev.azure.com/t10motorsport/ForzaTech/_workitems/edit/1543941
          this.timerReferenceOptions = new Map([
            ['3a9b1321-792c-47d1-ad40-b2dc39bf62b3', 'Chapter 1: GA Pre-Season - Chapter 1'],
            ['bbb41fc3-1e92-40f8-9b0a-cead82d4f2c5', 'Chapter 2: GA Pre-Season - Chapter 2'],
          ]);
        } else if (data == TimerInstance.Ladder) {
          this.selectedTimerReferenceInstance = TimerReferenceInstance.Ladder;

          if (this.ladderReferences) {
            this.timerReferenceOptions = this.ladderReferences;
          } else {
            this.getTimerReferenceMonitor = this.getTimerReferenceMonitor.repeat();
            steelheadBuildersCupService
              .getBuildersCupLadders$()
              .pipe(this.getTimerReferenceMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
              .subscribe(ladderReferences => {
                this.ladderReferences = ladderReferences;
                this.timerReferenceOptions = this.ladderReferences;
              });
          }
        } else if (data == TimerInstance.Season) {
          this.selectedTimerReferenceInstance = TimerReferenceInstance.Season;
          // TODO: Get data from projection https://dev.azure.com/t10motorsport/ForzaTech/_workitems/edit/1543941
          this.timerReferenceOptions = new Map([
            ['b0344978-c1cc-4cb0-bff8-422bb9cd21c2', 'Season 1:GA Pre-Season'],
          ]);
        } else if (data == TimerInstance.Series) {
          this.selectedTimerReferenceInstance = TimerReferenceInstance.Series;

          if (this.seriesReferences) {
            this.timerReferenceOptions = this.seriesReferences;
          } else {
            this.getTimerReferenceMonitor = this.getTimerReferenceMonitor.repeat();
            const getBuildersCupSeries$ = steelheadBuildersCupService.getBuildersCupSeries$();
            const getRacersCupSeries$ = steelheadRacersCupService.getRacersCupSeries$();

            combineLatest([getBuildersCupSeries$, getRacersCupSeries$])
              .pipe(this.getTimerReferenceMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
              .subscribe(([builderCupSeries, racersCupSeries]) => {
                const mergeMap = new Map<string, string>();
                [...Object.entries(builderCupSeries), ...Object.entries(racersCupSeries)].forEach(
                  ([key, value]) => {
                    mergeMap.set(key, value);
                  },
                );
                this.seriesReferences = mergeMap;
                this.timerReferenceOptions = this.seriesReferences;
              });
          }
        } else if (data == TimerInstance.Custom) {
          this.selectedTimerReferenceInstance = undefined;
          this.timerReferenceOptions = undefined;
        }
      });
  }

  /** Clears the tile image path input */
  public clearTileImagePath(): void {
    this.formControls.tileImagePath.setValue(null);
  }

  /** Form control hook. */
  public writeValue(data: BaseTileFormValue): void {
    if (data) {
      this.formControls.size.setValue(data.size);
      this.formControls.tileImagePath.setValue(data.tileImagePath);

      this.formControls.localizedTileDescription.reset();
      this.formControls.localizedTileTitle.reset();
      this.formControls.localizedTileType.reset();

      if (data.tileDescription.locref) {
        this.formControls.localizedTileDescription.setValue({
          id: data.tileDescription.locref,
        });
      }
      if (data.tileTitle.locref) {
        this.formControls.localizedTileTitle.setValue({
          id: data.tileTitle.locref,
        });
      }
      if (data.tileType.locref) {
        this.formControls.localizedTileType.setValue({
          id: data.tileType.locref,
        });
      }

      // Timer
      this.formControls.timerInstance.setValue(data.timer.typeName);
      this.formControls.timerType.setValue(data.timer.timerType);
      if (data.timer.startTextOverride?.refId) {
        this.formControls.timerLocalizedStartTextOverride.setValue({
          id: data.timer.startTextOverride.refId,
        });
      }
      if (data.timer.endTextOverride?.refId) {
        this.formControls.timerLocalizedEndTextOverride.setValue({
          id: data.timer.endTextOverride.refId,
        });
      }
      if (data.timer.customRange) {
        this.formControls.timerCustomFromDate.setValue(data.timer.customRange.from.dateUtc);
        this.formControls.timerCustomToDate.setValue(data.timer.customRange.to.dateUtc);
      }
      if (data.timer.timerReference) {
        this.formControls.timerReferenceId.setValue(data.timer.timerReference.refId);
      }

      // Display conditions
      this.formControls.displayConditions.clear();
      if (data.displayConditions.item) {
        for (const displayCondition of data.displayConditions.item) {
          this.addDisplayCondition(displayCondition.refId, displayCondition.when);
        }
      }
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: BaseTileFormValue) => void): void {
    this.formGroup.valueChanges
      .pipe(
        startWith(null),
        pairwise(),
        filter(([prev, cur]) => {
          return prev !== cur;
        }),
        map(([_prev, cur]) => cur),
        takeUntil(this.onDestroy$),
      )
      .subscribe(fn);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return collectErrors(this.formGroup);
    }

    return null;
  }

  /** Set the basic field of a welcome center tile using the form values. */
  public mapFormToWelcomeCenterTile(welcomeCenterTile: WelcomeCenterTile) {
    welcomeCenterTile.tileImagePath = this.formControls.tileImagePath.value;
    welcomeCenterTile.size = this.formControls.size.value;

    // Localization data
    welcomeCenterTile.tileDescription.locref = this.formControls.localizedTileDescription.value?.id;
    welcomeCenterTile.tileTitle.locref = this.formControls.localizedTileTitle.value?.id;
    welcomeCenterTile.tileType.locref = this.formControls.localizedTileType.value?.id;

    // Timer
    if (this.formControls.timerInstance.value) {
      welcomeCenterTile.timer = {
        endTextOverride: { refId: this.formControls.timerLocalizedEndTextOverride.value?.id },
        startTextOverride: { refId: this.formControls.timerLocalizedStartTextOverride.value?.id },
        timerType: this.formControls.timerType.value,
        typeName: this.formControls.timerInstance.value,
        customRange: undefined,
        timerReference: undefined,
      };

      if (this.formControls.timerInstance.value == TimerInstance.Custom) {
        welcomeCenterTile.timer.customRange = {
          from: {
            dateUtc: this.formControls.timerCustomFromDate.value,
            when: undefined,
          },
          to: {
            dateUtc: this.formControls.timerCustomToDate.value,
            when: undefined,
          },
        };
      } else {
        welcomeCenterTile.timer.timerReference = {
          refId: this.formControls.timerReferenceId.value,
          timerInstance: this.selectedTimerReferenceInstance,
        };
      }
    } else {
      welcomeCenterTile.timer = null;
    }

    if (this.formControls.displayConditions.controls.length > 0) {
      welcomeCenterTile.displayConditions.item = [];
      this.formControls.displayConditions.controls.forEach(element => {
        welcomeCenterTile.displayConditions.item.push({
          refId: element.reference.value,
          when: element.when.value,
        });
      });
    } else {
      welcomeCenterTile.displayConditions.item = null;
    }
  }

  /** Removes the selected timer instance. */
  public removeTimerInstance(): void {
    this.formControls.timerInstance.setValue(undefined);
  }

  /** Add a new display condition. */
  public addDisplayCondition(reference: string, when: string): void {
    const newDisplayConditionForm = new DisplayConditionItemFormGroup({
      reference: new FormControl(reference, [Validators.required]),
      when: new FormControl(when),
    });
    this.formControls.displayConditions.push(newDisplayConditionForm);
  }

  /** Remove the selected display condition. */
  public removeDisplayCondition(index: number): void {
    this.formControls.displayConditions.removeAt(index);
  }
}
