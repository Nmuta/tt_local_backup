import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { GameTitle } from '@models/enums';
import { PullRequest } from '@models/git-operation';
import { LocalizedStringsMap } from '@models/localization';
import {
  DeeplinkTile,
  WelcomeCenterTile,
  DestinationType,
  BuildersCupSettingType,
  RivalsSettingType,
  RacersCupDestination,
  BuildersCupDestination,
  RivalsDestination,
  ShowroomSettingType,
  ShowroomDestination,
  StoreSettingType,
  StoreDestination,
} from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadDeeplinkTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/deeplink/steelhead-deeplink-tiles.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, combineLatest, takeUntil } from 'rxjs';
import { GeneralTileComponent } from '../steelhead-general-tile.component';
import { VerifyButtonComponent } from '@shared/modules/verify/verify-button/verify-button.component';
import { SteelheadBuildersCupService } from '@services/api-v2/steelhead/builders-cup/steelhead-builders-cup.service';
import { SteelheadRacersCupService } from '@services/api-v2/steelhead/racers-cup/steelhead-racers-cup.service';
import { SteelheadRivalsService } from '@services/api-v2/steelhead/rivals/steelhead-rivals.service';
import { SteelheadCarsService } from '@services/api-v2/steelhead/cars/steelhead-cars.service';
import { SteelheadStoreService } from '@services/api-v2/steelhead/store/steelhead-store.service';

/** The deeplink tile component. */
@Component({
  selector: 'steelhead-deeplink-tile',
  templateUrl: './steelhead-deeplink-tile.component.html',
  styleUrls: ['./steelhead-deeplink-tile.component.scss'],
})
export class DeeplinkTileComponent extends BaseComponent implements OnChanges {
  @ViewChild(VerifyButtonComponent) verifyBtn: VerifyButtonComponent;
  @ViewChild(GeneralTileComponent) generalTileComponent: GeneralTileComponent;

  /** The deeplink tile representing the currently selected tile. */
  @Input() deeplinkTile: DeeplinkTile;
  /** The id of the tile currently being shown/modified. */
  @Input() tileId;
  /** If the form is in edit mode. */
  @Input() public readonly isInEditMode: boolean = false;
  /** Event emitted when edit mode needs to be updated. */
  @Output() changeEditMode = new EventEmitter<boolean>();
  /** Event emitted when a new pûll request was created. */
  @Output() newPullRequestCreated = new EventEmitter<PullRequest>();

  public gameTitle = GameTitle.FM8;
  public submitWelcomeCenterTileMonitor = new ActionMonitor('POST Welcome Center Tile');
  public referenceDataMonitor = new ActionMonitor('GET Reference Data');
  public pullRequestUrl: string;
  public localizationSelectServiceContract: SelectLocalizedStringContract;
  public destinationType: string[] = [
    DestinationType.BuildersCup,
    DestinationType.RacersCup,
    DestinationType.Showroom,
    DestinationType.PatchNotes,
    DestinationType.Rivals,
    DestinationType.Store,
  ];
  public buildersCupSetting: string[] = [
    BuildersCupSettingType.Homepage,
    BuildersCupSettingType.Ladder,
    BuildersCupSettingType.Series,
  ];
  public rivalsSetting: string[] = [
    RivalsSettingType.Homepage,
    RivalsSettingType.Event,
    RivalsSettingType.Category,
  ];
  public showroomSetting: string[] = [
    ShowroomSettingType.Homepage,
    ShowroomSettingType.Car,
    ShowroomSettingType.Manufacturer,
  ];
  public storeSetting: string[] = [StoreSettingType.Homepage, StoreSettingType.Product];

  public destinationTypes = DestinationType;
  public buildersCupSettingTypes = BuildersCupSettingType;
  public rivalsSettingTypes = RivalsSettingType;
  public showroomSettingTypes = ShowroomSettingType;
  public storeSettingTypes = StoreSettingType;
  public buildersCupChampionships: Map<string, string>;
  public buildersCupSeries: Map<string, string>;
  public buildersCupLadders: Map<string, string>;
  public racersCupSeries: Map<string, string>;
  public rivalsEvents: Map<string, string>;
  public rivalsCategories: Map<string, string>;
  public showroomCars: Map<string, string>;
  public showroomManufacturers: Map<string, string>;
  public storeProducts: Map<string, string>;

  public formControls = {
    baseTile: new FormControl(null),
    destinationType: new FormControl(null),
    category: new FormControl(null),
    buildersCupSettingType: new FormControl(null),
    buildersCupChampionship: new FormControl(null),
    buildersCupLadder: new FormControl(null),
    buildersCupSeries: new FormControl(null),
    racersCupSeries: new FormControl(null),
    rivalsSettingType: new FormControl(null),
    rivalsCategory: new FormControl(null),
    rivalsEvent: new FormControl(null),
    showroomSettingType: new FormControl(null),
    showroomCar: new FormControl(null),
    showroomManufacturer: new FormControl(null),
    storeSettingType: new FormControl(null),
    storeProduct: new FormControl(null),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  public readonly permAttribute = PermAttributeName.UpdateWelcomeCenterTiles;

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    steelheadBuildersCupService: SteelheadBuildersCupService,
    steelheadRacersCupService: SteelheadRacersCupService,
    steelheadRivalsService: SteelheadRivalsService,
    steelheadCarsService: SteelheadCarsService,
    steelheadStoreService: SteelheadStoreService,
    private readonly steelheadDeeplinkTileService: SteelheadDeeplinkTileService,
  ) {
    super();

    this.localizationSelectServiceContract = {
      gameTitle: this.gameTitle,
      getLocalizedStrings$(): Observable<LocalizedStringsMap> {
        return steelheadLocalizationService.getLocalizedStrings$();
      },
    };

    this.formControls.destinationType.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(destination => {
        if (destination == DestinationType.BuildersCup) {
          if (
            !this.buildersCupChampionships ||
            !this.buildersCupLadders ||
            !this.buildersCupSeries
          ) {
            const getBuildersCupChampionships$ =
              steelheadBuildersCupService.getBuildersCupChampionships$();
            const getBuildersCupLadders$ = steelheadBuildersCupService.getBuildersCupLadders$();
            const getBuildersCupSeries$ = steelheadBuildersCupService.getBuildersCupSeries$();

            this.referenceDataMonitor = this.referenceDataMonitor.repeat();
            combineLatest([
              getBuildersCupChampionships$,
              getBuildersCupLadders$,
              getBuildersCupSeries$,
            ])
              .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
              .subscribe(([championships, ladders, series]) => {
                this.buildersCupChampionships = championships;
                this.buildersCupLadders = ladders;
                this.buildersCupSeries = series;
              });
          }
        } else if (destination == DestinationType.RacersCup) {
          this.referenceDataMonitor = this.referenceDataMonitor.repeat();
          steelheadRacersCupService
            .getRacersCupSeries$()
            .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
            .subscribe(series => {
              this.racersCupSeries = series;
            });
        } else if (destination == DestinationType.Rivals) {
          const getRivalsCategories$ = steelheadRivalsService.getRivalsEventCategories$();
          const getRivalsEvents$ = steelheadRivalsService.getRivalsEventReference$();

          this.referenceDataMonitor = this.referenceDataMonitor.repeat();
          combineLatest([getRivalsCategories$, getRivalsEvents$])
            .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
            .subscribe(([categories, events]) => {
              this.rivalsCategories = categories;
              this.rivalsEvents = events;
            });
        } else if (destination == DestinationType.Showroom) {
          const getShowroomCars$ = steelheadCarsService.getCarsReference$();
          const getShowroomManufacturers$ = steelheadCarsService.getCarManufacturers$();

          this.referenceDataMonitor = this.referenceDataMonitor.repeat();
          combineLatest([getShowroomCars$, getShowroomManufacturers$])
            .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
            .subscribe(([cars, manufacturers]) => {
              this.showroomCars = cars;
              this.showroomManufacturers = manufacturers;
            });
        } else if (destination == DestinationType.Store) {
          this.referenceDataMonitor = this.referenceDataMonitor.repeat();
          steelheadStoreService
            .getStoreEntitlements$()
            .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
            .subscribe(entitlements => {
              this.storeProducts = entitlements;
            });
        }
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.deeplinkTile) {
      this.setFields(this.deeplinkTile);
    }

    if (changes.isInEditMode) {
      if (this.isInEditMode) {
        this.formGroup.enable();
        this.pullRequestUrl = '';
      } else {
        if (this.verifyBtn) {
          this.verifyBtn.isVerified = false;
        }
        this.formGroup.disable();
      }
    }
  }

  /** Submit welcome center tile modification. */
  public submitChanges(): void {
    this.submitWelcomeCenterTileMonitor = this.submitWelcomeCenterTileMonitor.repeat();
    this.changeEditMode.emit(false);

    // Deeplink specific field
    const destinationType = this.formControls.destinationType.value;

    // Racers Cup
    if (destinationType == DestinationType.RacersCup) {
      this.deeplinkTile.destination = {
        series: this.formControls.racersCupSeries.value,
        destinationType: destinationType,
      } as RacersCupDestination;
    }

    // Showroom
    if (destinationType == DestinationType.Showroom) {
      const showroomDestination = {
        settingType: this.formControls.showroomSettingType.value,
        destinationType: destinationType,
      } as ShowroomDestination;

      if (showroomDestination.settingType == ShowroomSettingType.Car) {
        showroomDestination.car = this.formControls.showroomCar.value;
      }
      if (showroomDestination.settingType == ShowroomSettingType.Manufacturer) {
        showroomDestination.manufacturer = this.formControls.showroomManufacturer.value;
      }

      this.deeplinkTile.destination = showroomDestination;
    }

    // Builders Cup
    if (destinationType == DestinationType.BuildersCup) {
      const buildersCupDestination = {
        settingType: this.formControls.buildersCupSettingType.value,
        destinationType: destinationType,
      } as BuildersCupDestination;

      if (buildersCupDestination.settingType == BuildersCupSettingType.Ladder) {
        buildersCupDestination.championship = this.formControls.buildersCupChampionship.value;
        buildersCupDestination.ladder = this.formControls.buildersCupLadder.value;
      }
      if (buildersCupDestination.settingType == BuildersCupSettingType.Series) {
        buildersCupDestination.championship = this.formControls.buildersCupChampionship.value;
        buildersCupDestination.series = this.formControls.buildersCupSeries.value;
      }

      this.deeplinkTile.destination = buildersCupDestination;
    }

    // Rivals
    if (destinationType == DestinationType.Rivals) {
      const rivalsDestination = {
        settingType: this.formControls.rivalsSettingType.value,
        destinationType: destinationType,
      } as RivalsDestination;

      if (rivalsDestination.settingType == RivalsSettingType.Category) {
        rivalsDestination.category = this.formControls.rivalsCategory.value;
      }
      if (rivalsDestination.settingType == RivalsSettingType.Event) {
        rivalsDestination.category = this.formControls.rivalsCategory.value;
        rivalsDestination.event = this.formControls.rivalsEvent.value;
      }

      this.deeplinkTile.destination = rivalsDestination;
    }

    // Store
    if (destinationType == DestinationType.Store) {
      const storeDestination = {
        settingType: this.formControls.storeSettingType.value,
        destinationType: destinationType,
      } as StoreDestination;

      if (storeDestination.settingType == StoreSettingType.Product) {
        storeDestination.product = this.formControls.storeProduct.value;
      }

      this.deeplinkTile.destination = storeDestination;
    }

    // Base tile fields
    this.generalTileComponent.mapFormToWelcomeCenterTile(this.deeplinkTile);

    this.steelheadDeeplinkTileService
      .submitDeeplinkTileModification$(this.tileId, this.deeplinkTile)
      .pipe(this.submitWelcomeCenterTileMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(pullrequest => {
        this.pullRequestUrl = pullrequest.webUrl;

        this.newPullRequestCreated.emit(pullrequest);
      });
  }

  /** Set form fields using the DeeplinkTile parameter. */
  private setFields(deeplinkTile: DeeplinkTile): void {
    this.formControls.destinationType.setValue(deeplinkTile.destination.destinationType);

    // Racers Cup
    if (deeplinkTile.destination.destinationType == DestinationType.RacersCup) {
      this.formControls.racersCupSeries.setValue(
        (deeplinkTile.destination as RacersCupDestination).series,
      );
    }

    // Builders Cup
    if (deeplinkTile.destination.destinationType == DestinationType.BuildersCup) {
      const buildersCupDestination = deeplinkTile.destination as BuildersCupDestination;
      this.formControls.buildersCupSettingType.setValue(buildersCupDestination.settingType);

      if (buildersCupDestination.settingType == BuildersCupSettingType.Ladder) {
        this.formControls.buildersCupChampionship.setValue(buildersCupDestination.championship);
        this.formControls.buildersCupLadder.setValue(buildersCupDestination.ladder);
      }
      if (buildersCupDestination.settingType == BuildersCupSettingType.Series) {
        this.formControls.buildersCupChampionship.setValue(buildersCupDestination.championship);
        this.formControls.buildersCupSeries.setValue(buildersCupDestination.series);
      }
    }

    // Showroom
    if (deeplinkTile.destination.destinationType == DestinationType.Showroom) {
      const showroomDestination = deeplinkTile.destination as ShowroomDestination;
      this.formControls.showroomSettingType.setValue(showroomDestination.settingType);

      if (showroomDestination.settingType == ShowroomSettingType.Car) {
        this.formControls.showroomCar.setValue(showroomDestination.car);
      }
      if (showroomDestination.settingType == ShowroomSettingType.Manufacturer) {
        this.formControls.showroomManufacturer.setValue(showroomDestination.manufacturer);
      }
    }

    //Rivals
    if (deeplinkTile.destination.destinationType == DestinationType.Rivals) {
      const rivalsDestination = deeplinkTile.destination as RivalsDestination;
      this.formControls.rivalsSettingType.setValue(rivalsDestination.settingType);

      if (rivalsDestination.settingType == RivalsSettingType.Category) {
        this.formControls.rivalsCategory.setValue(rivalsDestination.category);
      }
      if (rivalsDestination.settingType == RivalsSettingType.Event) {
        this.formControls.rivalsCategory.setValue(rivalsDestination.category);
        this.formControls.rivalsEvent.setValue(rivalsDestination.event);
      }
    }

    // Store
    if (deeplinkTile.destination.destinationType == DestinationType.Store) {
      const storeDestination = deeplinkTile.destination as StoreDestination;
      this.formControls.storeSettingType.setValue(storeDestination.settingType);

      if (storeDestination.settingType == StoreSettingType.Product) {
        this.formControls.storeProduct.setValue(storeDestination.product);
      }
    }

    const baseTile = {
      tileImagePath: deeplinkTile.tileImagePath,
      size: deeplinkTile.size,
      tileDescription: deeplinkTile.tileDescription,
      tileTitle: deeplinkTile.tileTitle,
      tileType: deeplinkTile.tileType,
      timer: deeplinkTile.timer,
      displayConditions: deeplinkTile.displayConditions,
    } as WelcomeCenterTile;

    this.formControls.baseTile.setValue(baseTile);
  }
}
