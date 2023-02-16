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
import { WelcomeCenterTile, WelcomeCenterTileSize } from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
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

  public formControls = {
    size: new FormControl(null, [Validators.required]),
    localizedTileTitle: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    localizedTileType: new FormControl({ value: {}, disabled: true }),
    localizedTileDescription: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    tileImagePath: new FormControl(null),
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
}
