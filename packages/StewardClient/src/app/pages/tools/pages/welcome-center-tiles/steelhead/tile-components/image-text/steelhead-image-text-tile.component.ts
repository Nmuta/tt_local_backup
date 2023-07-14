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
import { ImageTextTile, WelcomeCenterTile } from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadImageTextTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/image-text/steelhead-image-text-tiles.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';
import { GeneralTileComponent } from '../steelhead-general-tile.component';
import { VerifyButtonComponent } from '@shared/modules/verify/verify-button/verify-button.component';

/** The image text tile component. */
@Component({
  selector: 'steelhead-image-text-tile',
  templateUrl: './steelhead-image-text-tile.component.html',
  styleUrls: ['./steelhead-image-text-tile.component.scss'],
})
export class ImageTextTileComponent extends BaseComponent implements OnChanges {
  @ViewChild(VerifyButtonComponent) verifyBtn: VerifyButtonComponent;
  @ViewChild(GeneralTileComponent) generalTileComponent: GeneralTileComponent;

  /** The image text tile representing the currently selected tile. */
  @Input() imageTextTile: ImageTextTile;
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
    contentImagePath: new FormControl(null),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  public readonly permAttribute = PermAttributeName.UpdateWelcomeCenterTiles;

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    private readonly steelheadImageTextTileService: SteelheadImageTextTileService,
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
    if (changes.imageTextTile) {
      this.setFields(this.imageTextTile);
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

  /** Clears the content image path input */
  public clearContentImagePath(): void {
    this.formControls.contentImagePath.setValue(null);
  }

  /** Submit welcome center tile modification. */
  public submitChanges(): void {
    this.submitWelcomeCenterTileMonitor = this.submitWelcomeCenterTileMonitor.repeat();
    this.changeEditMode.emit(false);

    // Image text tile specific field
    this.imageTextTile.contentImagePath = this.formControls.contentImagePath.value;

    // Base tile fields
    this.generalTileComponent.mapFormToWelcomeCenterTile(this.imageTextTile);

    this.steelheadImageTextTileService
      .submitImageTextTileModification$(this.tileId, this.imageTextTile)
      .pipe(this.submitWelcomeCenterTileMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(pullrequest => {
        this.pullRequestUrl = pullrequest.webUrl;

        this.newPullRequestCreated.emit(pullrequest);
      });
  }

  /** Set form fields using the ImageTextTile parameter. */
  private setFields(imageTextTile: ImageTextTile): void {
    this.formControls.contentImagePath.setValue(imageTextTile.contentImagePath);

    const baseTile = {
      tileImagePath: imageTextTile.tileImagePath,
      size: imageTextTile.size,
      tileDescription: imageTextTile.tileDescription,
      tileTitle: imageTextTile.tileTitle,
      tileType: imageTextTile.tileType,
      timer: imageTextTile.timer,
      displayConditions: imageTextTile.displayConditions,
    } as WelcomeCenterTile;

    this.formControls.baseTile.setValue(baseTile);
  }
}
