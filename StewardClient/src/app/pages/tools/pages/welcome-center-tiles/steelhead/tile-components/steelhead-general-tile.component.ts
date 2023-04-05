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
import { collectErrors } from '@helpers/form-group-collect-errors';
import { GameTitle } from '@models/enums';
import { LocalizedStringsMap } from '@models/localization';
import {
  TimerReferenceInstance,
  TimerType,
  TimerInstance,
  WelcomeCenterTile,
  WelcomeCenterTileSize,
} from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { DateTime } from 'luxon';
import { filter, map, Observable, pairwise, startWith, takeUntil } from 'rxjs';

/** Outputted form value of the base tile form. */
export type BaseTileFormValue = WelcomeCenterTile;

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

  public timerInstanceEnum = TimerInstance;
  public timerTypeEnum = TimerType;
  public timerReferenceOptions: Map<string, string>;
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
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  constructor(steelheadLocalizationService: SteelheadLocalizationService) {
    super();

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
          this.timerReferenceOptions = new Map([
            ['3a9b1321-792c-47d1-ad40-b2dc39bf62b3', 'Chapter 1: GA Pre-Season - Chapter 1'],
            ['bbb41fc3-1e92-40f8-9b0a-cead82d4f2c5', 'Chapter 1: GA Pre-Season - Chapter 1'],
          ]);
        } else if (data == TimerInstance.Ladder) {
          this.selectedTimerReferenceInstance = TimerReferenceInstance.Ladder;
          this.timerReferenceOptions = new Map([
            ['6d3e623d-3b4f-4239-8cfd-85ac9b5ed573', 'Modern Race Car Tour'],
            ['b4cfc5b1-fbf4-4cef-9fe9-9970d71bb642', 'Decades Tour'],
          ]);
        } else if (data == TimerInstance.Season) {
          this.selectedTimerReferenceInstance = TimerReferenceInstance.Season;
          this.timerReferenceOptions = new Map([
            ['b0344978-c1cc-4cb0-bff8-422bb9cd21c2', 'Season 1:GA Pre-Season'],
          ]);
        } else if (data == TimerInstance.Series) {
          this.selectedTimerReferenceInstance = TimerReferenceInstance.Series;
          this.timerReferenceOptions = new Map([
            ['03390be2-c878-40c3-8eab-f7370688ad04', 'Test Entry Series'],
            ['1f3ce4b5-fade-4341-80cb-0006c8c9b122', 'Vintage LM Prototypes Series'],
          ]);
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
  }

  /** Removes the selected timer instance. */
  public removeTimerInstance(): void {
    this.formControls.timerInstance.setValue(undefined);
  }
}
