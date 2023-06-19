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
import { Observable, takeUntil } from 'rxjs';
import { GeneralTileComponent } from '../steelhead-general-tile.component';
import { VerifyButtonComponent } from '@shared/modules/verify/verify-button/verify-button.component';

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
  public showRoomCategories: Map<string, string>;
  public championships: Map<string, string>;
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
    private readonly steelheadDeeplinkTileService: SteelheadDeeplinkTileService,
  ) {
    super();

    this.localizationSelectServiceContract = {
      gameTitle: this.gameTitle,
      getLocalizedStrings$(): Observable<LocalizedStringsMap> {
        return steelheadLocalizationService.getLocalizedStrings$();
      },
    };

    this.showRoomCategories = new Map([
      ['bfccc7e2-3200-4bb6-9ba1-5395c51422c5', 'Pontiac'],
      ['a05afb61-1c62-4885-9bd5-62d28c3f46b3', 'Audi'],
    ]);

    this.championships = new Map([['575e903e-c2a4-4993-a1b9-de565c17391a', 'Main BC']]);

    this.buildersCupLadders = new Map([
      ['6d3e623d-3b4f-4239-8cfd-85ac9b5ed573', 'Modern Race Car Tour'],
      ['b4cfc5b1-fbf4-4cef-9fe9-9970d71bb642', 'Decades Tour'],
    ]);

    this.buildersCupSeries = new Map([
      ['03390be2-c878-40c3-8eab-f7370688ad04', 'Test Entry Series'],
      ['1f3ce4b5-fade-4341-80cb-0006c8c9b122', 'Vintage LM Prototypes Series'],
    ]);

    this.racersCupSeries = new Map([
      ['7d838ee4-aeb8-4dbd-8450-2720cdc7c92f', 'Test'],
      ['575e903e-c2a4-4993-a1b9-de565c17391a', 'C Class'],
      ['9aa6aefa-172f-4c75-ac22-d579b121a259', 'D Class'],
      ['55f3ade3-6f6f-4a5d-a16b-73c277e54fbb', 'Spotlight Series'],
    ]);

    this.rivalsCategories = new Map([
      ['66d3b507-b755-40cf-9eb1-7b5550b05d3d', 'Featured'],
      ['b6e05fbc-6d03-460f-b6e3-c6c34db0e36a', 'VIP'],
    ]);

    this.rivalsEvents = new Map([
      ['e9d7dec3-97ca-443b-96f3-b6794930aebd', 'Spotlight - Rally Rivals'],
      ['f64fab1d-9490-4476-a20a-e7e1b29087a5', 'Spotlight - American Feud'],
    ]);

    this.showroomCars = new Map([
      ['00000001-0000-0000-0000-000000001020', '1996 F50 GT'],
      ['00000001-0000-0000-0000-000000001047', 'Yaris 2008'],
    ]);

    this.showroomManufacturers = new Map([
      ['00000013-0000-0000-0000-000000000010', 'Chrysler'],
      ['00000013-0000-0000-0000-000000000155', 'Quartz'],
    ]);

    this.storeProducts = new Map([
      ['f43a3396-310c-420a-9082-5ab2fcd43d98', 'Premium Add-On'],
      ['3695615f-2e60-4e6c-b605-f38a0f7cfc80', 'Car Pass'],
    ]);
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
