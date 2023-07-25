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
import { DeeplinkTile, WelcomeCenterTile, DestinationType } from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadDeeplinkTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/deeplink/steelhead-deeplink-tiles.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';
import { GeneralTileComponent } from '../steelhead-general-tile.component';
import { VerifyButtonComponent } from '@shared/modules/verify/verify-button/verify-button.component';
import { DeeplinkStoreComponent } from './components/store/steelhead-deeplink-store.component';
import { DeeplinkShowroomComponent } from './components/showroom/steelhead-deeplink-showroom.component';
import { DeeplinkRivalsComponent } from './components/rivals/steelhead-deeplink-rivals.component';
import { DeeplinkBuildersCupComponent } from './components/builders-cup/steelhead-deeplink-builders-cup.component';
import { DeeplinkRacersCupComponent } from './components/racers-cup/steelhead-deeplink-racers-cup.component';

/** The deeplink tile component. */
@Component({
  selector: 'steelhead-deeplink-tile',
  templateUrl: './steelhead-deeplink-tile.component.html',
  styleUrls: ['./steelhead-deeplink-tile.component.scss'],
})
export class DeeplinkTileComponent extends BaseComponent implements OnChanges {
  @ViewChild(VerifyButtonComponent) verifyBtn: VerifyButtonComponent;
  @ViewChild(GeneralTileComponent) generalTileComponent: GeneralTileComponent;
  @ViewChild(DeeplinkStoreComponent) deeplinkStoreComponent: DeeplinkStoreComponent;
  @ViewChild(DeeplinkShowroomComponent) deeplinkShowroomComponent: DeeplinkStoreComponent;
  @ViewChild(DeeplinkRivalsComponent) deeplinkRivalsComponent: DeeplinkRivalsComponent;
  @ViewChild(DeeplinkBuildersCupComponent)
  deeplinkBuildersCupComponent: DeeplinkBuildersCupComponent;
  @ViewChild(DeeplinkRacersCupComponent) deeplinkRacersCupComponent: DeeplinkRacersCupComponent;

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

  public destinationTypes = DestinationType;

  public formControls = {
    baseTile: new FormControl(null),
    baseDestination: new FormControl(null),
    destinationType: new FormControl(null),
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
      this.deeplinkTile.destination = this.deeplinkRacersCupComponent.mapFormToDestination();
    }

    // Showroom
    if (destinationType == DestinationType.Showroom) {
      this.deeplinkTile.destination = this.deeplinkShowroomComponent.mapFormToDestination();
    }

    // Builders Cup
    if (destinationType == DestinationType.BuildersCup) {
      this.deeplinkTile.destination = this.deeplinkBuildersCupComponent.mapFormToDestination();
    }

    // Rivals
    if (destinationType == DestinationType.Rivals) {
      this.deeplinkTile.destination = this.deeplinkRivalsComponent.mapFormToDestination();
    }

    // Store
    if (destinationType == DestinationType.Store) {
      this.deeplinkTile.destination = this.deeplinkStoreComponent.mapFormToDestination();
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
    this.formControls.baseDestination.setValue(deeplinkTile.destination);

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
