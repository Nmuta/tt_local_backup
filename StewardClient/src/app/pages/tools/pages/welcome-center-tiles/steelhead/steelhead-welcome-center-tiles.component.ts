import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseComponent } from '@components/base-component/base.component';
import { CreateLocalizedStringContract } from '@components/localization/create-localized-string/create-localized-string.component';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { GameTitle } from '@models/enums';
import { LocalizedStringData, LocalizedStringsMap } from '@models/localization';
import { WelcomeCenterTile, FriendlyNameMap, WelcomeCenterTileSize } from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadWelcomeCenterTileService } from '@services/api-v2/steelhead/welcome-center-tiles/steelhead-welcome-center-tiles.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';

/** The Steelhead welcome center tile page. */
@Component({
  templateUrl: './steelhead-welcome-center-tiles.component.html',
  styleUrls: ['./steelhead-welcome-center-tiles.component.scss'],
})
export class SteelheadWelcomeCenterTilesComponent extends BaseComponent implements OnInit {
  @ViewChild(MatCheckbox) verifyCheckbox: MatCheckbox;

  public gameTitle = GameTitle.FM8;
  public getListActionMonitor = new ActionMonitor('GET Welcome Center Tile list');
  public getTileActionMonitor = new ActionMonitor('GET Welcome Center Tile');
  public submitWelcomeCenterTileMonitor = new ActionMonitor('POST Welcome Center Tile');
  public localizationCreationServiceContract: CreateLocalizedStringContract;
  public localizationSelectServiceContract: SelectLocalizedStringContract;
  public friendlyNameList: FriendlyNameMap;
  public isInEditMode: boolean = false;
  public currentWelcomeCenterTile: WelcomeCenterTile;
  public pullRequestUrl: string;
  public sizes: string[] = [WelcomeCenterTileSize.Large, WelcomeCenterTileSize.Medium];

  public formControls = {
    selectedWelcomeCenterTile: new FormControl(null, [Validators.required]),
    size: new FormControl(null, [Validators.required]),
    localizedTileTitle: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    localizedTileType: new FormControl({ value: {}, disabled: true }),
    localizedTileDescription: new FormControl({ value: {}, disabled: true }, [Validators.required]),
    contentImagePath: new FormControl(null),
    tileImagePath: new FormControl(null),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    private readonly steelheadWelcomeCenterTileService: SteelheadWelcomeCenterTileService,
  ) {
    super();

    this.localizationCreationServiceContract = {
      gameTitle: this.gameTitle,
      postStringForLocalization$(localizedStringData: LocalizedStringData): Observable<void> {
        return steelheadLocalizationService.postLocalizedString$(localizedStringData);
      },
    };

    this.localizationSelectServiceContract = {
      gameTitle: this.gameTitle,
      getLocalizedStrings$(): Observable<LocalizedStringsMap> {
        return steelheadLocalizationService.getLocalizedStrings$();
      },
    };
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.steelheadWelcomeCenterTileService
      .getWelcomeCenterTiles$()
      .pipe(this.getListActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(friendlyNameMap => {
        this.friendlyNameList = friendlyNameMap;
      });
  }

  /** Clears the content image path input */
  public clearContentImagePath(): void {
    this.formControls.contentImagePath.setValue(null);
  }

  /** Clears the tile image path input */
  public clearTileImagePath(): void {
    this.formControls.tileImagePath.setValue(null);
  }

  /** Loads the selected Welcome Center Tile data. */
  public welcomeCenterTileChanged(): void {
    this.getTileActionMonitor = this.getTileActionMonitor.repeat();
    this.isInEditMode = false;
    this.verifyCheckbox.checked = false;

    this.steelheadWelcomeCenterTileService
      .getWelcomeCenterTile$(this.formControls.selectedWelcomeCenterTile.value)
      .pipe(this.getTileActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(welcomeCenterTile => {
        this.currentWelcomeCenterTile = welcomeCenterTile;
        this.setFields(welcomeCenterTile);
      });
  }

  /** Remove changes made to the welcome center tile and bring back the actual values. */
  public revertEntryEdit(): void {
    this.isInEditMode = false;
    this.verifyCheckbox.checked = false;

    this.formControls.localizedTileDescription.disable();
    this.formControls.localizedTileTitle.disable();
    this.formControls.localizedTileType.disable();

    this.setFields(this.currentWelcomeCenterTile);
  }

  /** Submit welcome center tile modification. */
  public submitChanges(): void {
    this.submitWelcomeCenterTileMonitor = this.submitWelcomeCenterTileMonitor.repeat();

    this.isInEditMode = false;
    this.verifyCheckbox.checked = false;

    this.currentWelcomeCenterTile.contentImagePath = this.formControls.contentImagePath.value;
    this.currentWelcomeCenterTile.tileImagePath = this.formControls.tileImagePath.value;
    this.currentWelcomeCenterTile.size = this.formControls.size.value;
    // Localization data
    this.currentWelcomeCenterTile.tileDescription.locref =
      this.formControls.localizedTileDescription.value?.id;
    this.currentWelcomeCenterTile.tileTitle.locref = this.formControls.localizedTileTitle.value?.id;
    this.currentWelcomeCenterTile.tileType.locref = this.formControls.localizedTileType.value?.id;

    this.steelheadWelcomeCenterTileService
      .submitModification$(
        this.formControls.selectedWelcomeCenterTile.value,
        this.currentWelcomeCenterTile,
      )
      .pipe(this.submitWelcomeCenterTileMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(url => {
        this.pullRequestUrl = url;
        this.isInEditMode = false;
        this.verifyCheckbox.checked = false;
        this.formControls.localizedTileDescription.disable();
        this.formControls.localizedTileTitle.disable();
        this.formControls.localizedTileType.disable();
      });
  }

  /** Toggle the form to edit mode, enabling all the fields. */
  public toggleEditMode(): void {
    this.isInEditMode = true;
    this.formControls.localizedTileDescription.enable();
    this.formControls.localizedTileTitle.enable();
    this.formControls.localizedTileType.enable();
  }

  /** Set form fields using the WelcomeCenterTile parameter. */
  private setFields(welcomeCenterTile: WelcomeCenterTile): void {
    this.formControls.contentImagePath.setValue(welcomeCenterTile.contentImagePath);
    this.formControls.tileImagePath.setValue(welcomeCenterTile.tileImagePath);
    this.formControls.size.setValue(welcomeCenterTile.size);

    // Localization data
    this.formControls.localizedTileDescription.reset();
    this.formControls.localizedTileTitle.reset();
    this.formControls.localizedTileType.reset();

    if (welcomeCenterTile.tileDescription.locref) {
      this.formControls.localizedTileDescription.setValue({
        id: welcomeCenterTile.tileDescription.locref,
      });
    }
    if (welcomeCenterTile.tileTitle.locref) {
      this.formControls.localizedTileTitle.setValue({
        id: welcomeCenterTile.tileTitle.locref,
      });
    }
    if (welcomeCenterTile.tileType.locref) {
      this.formControls.localizedTileType.setValue({
        id: welcomeCenterTile.tileType.locref,
      });
    }
  }
}
