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
import { MatCheckbox } from '@angular/material/checkbox';
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
} from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadDeeplinkTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/deeplink/steelhead-deeplink-tiles.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';
import { GeneralTileComponent } from '../steelhead-general-tile.component';

/** The deeplink tile component. */
@Component({
  selector: 'steelhead-deeplink-tile',
  templateUrl: './steelhead-deeplink-tile.component.html',
  styleUrls: ['./steelhead-deeplink-tile.component.scss'],
})
export class DeeplinkTileComponent extends BaseComponent implements OnChanges {
  @ViewChild(MatCheckbox) verifyCheckbox: MatCheckbox;
  @ViewChild(GeneralTileComponent) generalTileComponent: GeneralTileComponent;

  /** The deeplink tile representing the currently selected tile. */
  @Input() deeplinkTile: DeeplinkTile;
  /** The id of the tile currently being shown/modified. */
  @Input() tileId;
  /** If the form in edit mode. */
  @Input() isInEditMode: boolean = false;
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
  ];
  public buildersCupSetting: string[] = [
    BuildersCupSettingType.Homepage,
    BuildersCupSettingType.Ladder,
    BuildersCupSettingType.Series,
  ];
  public destinationTypes = DestinationType;
  public buildersCupSettingTypes = BuildersCupSettingType;
  public showRoomCategories: Map<string, string>;
  public championships: Map<string, string>;
  public series: Map<string, string>;
  public ladders: Map<string, string>;

  public formControls = {
    baseTile: new FormControl(null),
    destinationType: new FormControl(null),
    category: new FormControl(null),
    settingType: new FormControl(null),
    championship: new FormControl(null),
    ladder: new FormControl(null),
    series: new FormControl(null),
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

    this.ladders = new Map([
      ['6d3e623d-3b4f-4239-8cfd-85ac9b5ed573', 'Modern Race Car Tour'],
      ['b4cfc5b1-fbf4-4cef-9fe9-9970d71bb642', 'Decades Tour'],
    ]);

    this.series = new Map([
      ['03390be2-c878-40c3-8eab-f7370688ad04', 'Test Entry Series'],
      ['1f3ce4b5-fade-4341-80cb-0006c8c9b122', 'Vintage LM Prototypes Series'],
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
        if (this.verifyCheckbox) {
          this.verifyCheckbox.checked = false;
        }
        this.formGroup.disable();
      }
    }
  }

  /** Submit welcome center tile modification. */
  public submitChanges(): void {
    this.submitWelcomeCenterTileMonitor = this.submitWelcomeCenterTileMonitor.repeat();
    this.isInEditMode = false;
    this.verifyCheckbox.checked = false;

    // Deeplink specific field
    this.deeplinkTile.destinationType = this.formControls.destinationType.value;
    if (this.deeplinkTile.destinationType == DestinationType.RacersCup) {
      // Not implemented yet
    }
    if (this.deeplinkTile.destinationType == DestinationType.Showroom) {
      this.deeplinkTile.manufacturer = this.formControls.category.value;
    }
    if (this.deeplinkTile.destinationType == DestinationType.BuildersCup) {
      this.deeplinkTile.buildersCupSettingType = this.formControls.settingType.value;
      if (this.deeplinkTile.buildersCupSettingType == BuildersCupSettingType.Ladder) {
        this.deeplinkTile.championship = this.formControls.championship.value;
        this.deeplinkTile.ladder = this.formControls.ladder.value;
      }
      if (this.deeplinkTile.buildersCupSettingType == BuildersCupSettingType.Series) {
        this.deeplinkTile.championship = this.formControls.championship.value;
        this.deeplinkTile.series = this.formControls.series.value;
      }
    }

    // Base tile fields
    this.generalTileComponent.mapFormToWelcomeCenterTile(this.deeplinkTile);

    this.steelheadDeeplinkTileService
      .submitDeeplinkTileModification$(this.tileId, this.deeplinkTile)
      .pipe(this.submitWelcomeCenterTileMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(pullrequest => {
        this.pullRequestUrl = pullrequest.webUrl;
        this.isInEditMode = false;
        this.formGroup.disable();

        this.newPullRequestCreated.emit(pullrequest);
      });
  }

  /** Set form fields using the DeeplinkTile parameter. */
  private setFields(deeplinkTile: DeeplinkTile): void {
    if (deeplinkTile.destinationType == DestinationType.RacersCup) {
      // not implemented yet
      this.formControls.destinationType.setValue(DestinationType.RacersCup);
    }
    if (deeplinkTile.destinationType == DestinationType.BuildersCup) {
      this.formControls.destinationType.setValue(DestinationType.BuildersCup);
      this.formControls.settingType.setValue(deeplinkTile.buildersCupSettingType);
      if (deeplinkTile.buildersCupSettingType == BuildersCupSettingType.Ladder) {
        this.formControls.championship.setValue(deeplinkTile.championship);
        this.formControls.ladder.setValue(deeplinkTile.ladder);
      }
      if (deeplinkTile.buildersCupSettingType == BuildersCupSettingType.Series) {
        this.formControls.championship.setValue(deeplinkTile.championship);
        this.formControls.series.setValue(deeplinkTile.series);
      }
    }
    if (deeplinkTile.destinationType == DestinationType.Showroom) {
      this.formControls.destinationType.setValue(DestinationType.Showroom);
      this.formControls.category.setValue(deeplinkTile.manufacturer);
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
