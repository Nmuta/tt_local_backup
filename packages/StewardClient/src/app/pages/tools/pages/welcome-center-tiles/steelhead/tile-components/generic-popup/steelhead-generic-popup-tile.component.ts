import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { GameTitle } from '@models/enums';
import { PullRequest } from '@models/git-operation';
import { LocalizedStringsMap } from '@models/localization';
import { GenericPopupTile, WelcomeCenterTile } from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadGenericPopupTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/generic-popup/steelhead-generic-popup-tiles.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';
import { GeneralTileComponent } from '../steelhead-general-tile.component';
import { VerifyButtonComponent } from '@shared/modules/verify/verify-button/verify-button.component';

/** The generic popup tile component. */
@Component({
  selector: 'steelhead-generic-popup-tile',
  templateUrl: './steelhead-generic-popup-tile.component.html',
  styleUrls: ['./steelhead-generic-popup-tile.component.scss'],
})
export class GenericPopupTileComponent extends BaseComponent implements OnChanges {
  @ViewChild(VerifyButtonComponent) verifyBtn: VerifyButtonComponent;
  @ViewChild(GeneralTileComponent) generalTileComponent: GeneralTileComponent;

  /** The generic popup tile representing the currently selected tile. */
  @Input() genericPopupTile: GenericPopupTile;
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

  public formControls = {
    baseTile: new FormControl(null),
    localizedPopupTitle: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    localizedPopupDescription: new FormControl({ value: {}, disabled: true }, [
      Validators.required,
    ]),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  public readonly permAttribute = PermAttributeName.UpdateWelcomeCenterTiles;

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    private readonly steelheadGenericPopupTileService: SteelheadGenericPopupTileService,
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
    if (changes.genericPopupTile) {
      this.setFields(this.genericPopupTile);
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

    // Generic popup tile specific field
    this.genericPopupTile.popupTitle.locref = this.formControls.localizedPopupTitle.value?.id;
    this.genericPopupTile.popupDescription.locref =
      this.formControls.localizedPopupDescription.value?.id;

    // Base tile fields
    this.generalTileComponent.mapFormToWelcomeCenterTile(this.genericPopupTile);

    this.steelheadGenericPopupTileService
      .submitGenericPopupTileModification$(this.tileId, this.genericPopupTile)
      .pipe(this.submitWelcomeCenterTileMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(pullrequest => {
        this.pullRequestUrl = pullrequest.webUrl;

        this.newPullRequestCreated.emit(pullrequest);
      });
  }

  /** Set form fields using the GenericPopupTile parameter. */
  private setFields(genericPopupTile: GenericPopupTile): void {
    if (genericPopupTile.popupTitle.locref) {
      this.formControls.localizedPopupTitle.setValue({
        id: genericPopupTile.popupTitle.locref,
      });
    }
    if (genericPopupTile.popupDescription.locref) {
      this.formControls.localizedPopupDescription.setValue({
        id: genericPopupTile.popupDescription.locref,
      });
    }

    const baseTile = {
      tileImagePath: genericPopupTile.tileImagePath,
      size: genericPopupTile.size,
      tileDescription: genericPopupTile.tileDescription,
      tileTitle: genericPopupTile.tileTitle,
      tileType: genericPopupTile.tileType,
      timer: genericPopupTile.timer,
      displayConditions: genericPopupTile.displayConditions,
    } as WelcomeCenterTile;

    this.formControls.baseTile.setValue(baseTile);
  }
}
