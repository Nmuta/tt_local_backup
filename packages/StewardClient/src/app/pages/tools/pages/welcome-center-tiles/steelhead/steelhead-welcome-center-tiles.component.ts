import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { BaseComponent } from '@components/base-component/base.component';
import { CreateLocalizedStringContract } from '@components/localization/create-localized-string/create-localized-string.component';
import { HCI } from '@environments/environment';
import { GameTitle } from '@models/enums';
import { PullRequest, PullRequestSubject } from '@models/git-operation';
import { LocalizedStringData } from '@models/localization';
import { FriendlyNameMap, TileType } from '@models/welcome-center';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadDeeplinkTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/deeplink/steelhead-deeplink-tiles.service';
import { SteelheadGenericPopupTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/generic-popup/steelhead-generic-popup-tiles.service';
import { SteelheadImageTextTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/image-text/steelhead-image-text-tiles.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep } from 'lodash';
import { combineLatest, debounceTime, map, Observable, startWith, takeUntil } from 'rxjs';

/** The Steelhead welcome center tile page. */
@Component({
  templateUrl: './steelhead-welcome-center-tiles.component.html',
  styleUrls: ['./steelhead-welcome-center-tiles.component.scss'],
})
export class SteelheadWelcomeCenterTilesComponent extends BaseComponent implements OnInit {
  public gameTitle = GameTitle.FM8;
  public getListActionMonitor = new ActionMonitor('GET Welcome Center Tile list');
  public getTileActionMonitor = new ActionMonitor('GET Welcome Center Tile');

  public getPullRequests = new ActionMonitor('GET Pull Requests');
  public localizationCreationServiceContract: CreateLocalizedStringContract;
  public friendlyNameImageTextList: FriendlyNameMap;
  public friendlyNameGenericPopupList: FriendlyNameMap;
  public friendlyNameDeeplinkList: FriendlyNameMap;
  public filterImageTextTiles: FriendlyNameMap;
  public filterGenericPopupTiles: FriendlyNameMap;
  public filterDeeplinkTiles: FriendlyNameMap;
  public isInEditMode: boolean = false;
  public currentWelcomeCenterTile;
  public tileTypes = TileType;

  // Welcome Center active PRs display
  public newActivePullRequest: PullRequest;
  public activePrSubject = PullRequestSubject.WorldOfForzaTile;

  // Loc string active PRs display
  public newLocStringActivePullRequest: PullRequest;
  public locStringActivePrSubject = PullRequestSubject.LocalizationString;
  public readonly permAttributeLocString = PermAttributeName.AddLocalizedString;

  public formControls = {
    selectedWelcomeCenterTile: new UntypedFormControl(null, [Validators.required]),
  };

  public formGroup: UntypedFormGroup = new UntypedFormGroup(this.formControls);

  public readonly permAttribute = PermAttributeName.UpdateWelcomeCenterTiles;

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    private readonly steelheadImageTextTileService: SteelheadImageTextTileService,
    private readonly steelheadGenericPopupTileService: SteelheadGenericPopupTileService,
    private readonly steelheadDeeplinkTileService: SteelheadDeeplinkTileService,
  ) {
    super();

    this.localizationCreationServiceContract = {
      gameTitle: this.gameTitle,
      postStringForLocalization$(
        localizedStringData: LocalizedStringData,
      ): Observable<PullRequest> {
        return steelheadLocalizationService.postLocalizedString$(localizedStringData);
      },
    };
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.getListActionMonitor = this.getListActionMonitor.repeat();

    combineLatest([
      this.steelheadImageTextTileService.getImageTextTiles$(),
      this.steelheadGenericPopupTileService.getGenericPopupTiles$(),
      this.steelheadDeeplinkTileService.getDeeplinkTiles$(),
    ])
      .pipe(this.getListActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(([imageTextTiles, genericPopupTiles, deeplinkTiles]) => {
        this.friendlyNameImageTextList = new Map<string, string>(Object.entries(imageTextTiles));
        this.friendlyNameGenericPopupList = new Map<string, string>(
          Object.entries(genericPopupTiles),
        );
        this.friendlyNameDeeplinkList = new Map<string, string>(Object.entries(deeplinkTiles));
        this.filterImageTextTiles = this.friendlyNameImageTextList;
        this.filterGenericPopupTiles = this.friendlyNameGenericPopupList;
        this.filterDeeplinkTiles = this.friendlyNameDeeplinkList;
      });

    this.formControls.selectedWelcomeCenterTile.valueChanges
      .pipe(
        debounceTime(HCI.TypingToAutoSearchDebounceMillis),
        startWith(''),
        map(value => {
          // When value as a 'key' property, it means one was selected
          if (value.key !== undefined) {
            return '';
          }
          return value;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(filter => {
        this.filterOptions(filter);
      });
  }

  /** Loads the selected Welcome Center Tile data. */
  public welcomeCenterTileChanged(event: MatOptionSelectionChange, tileType: TileType): void {
    if (!event.isUserInput) {
      return;
    }
    this.getTileActionMonitor = this.getTileActionMonitor.repeat();
    this.isInEditMode = false;

    if (tileType == TileType.ImageText) {
      this.steelheadImageTextTileService
        .getImageTextTile$(event.source.value.key)
        .pipe(this.getTileActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(welcomeCenterTile => {
          this.currentWelcomeCenterTile = welcomeCenterTile;
        });
    } else if (tileType == TileType.GenericPopup) {
      this.steelheadGenericPopupTileService
        .getGenericPopupTile$(event.source.value.key)
        .pipe(this.getTileActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(welcomeCenterTile => {
          this.currentWelcomeCenterTile = welcomeCenterTile;
        });
    } else if (tileType == TileType.Deeplink) {
      this.steelheadDeeplinkTileService
        .getDeeplinkTile$(event.source.value.key)
        .pipe(this.getTileActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(welcomeCenterTile => {
          this.currentWelcomeCenterTile = welcomeCenterTile;
        });
    }
  }

  /** Remove changes made to the welcome center tile and bring back the actual values. */
  public revertEntryEdit(): void {
    this.isInEditMode = false;
    this.currentWelcomeCenterTile = cloneDeep(this.currentWelcomeCenterTile);
  }

  /** Changes the form to edit mode, enabling all the fields. */
  public changeEditMode(isInEditMode: boolean): void {
    this.isInEditMode = isInEditMode;
  }

  /** Mat autocomplete display string.  */
  public displayWelcomeCenterTiles(welcomeCenterTile): string {
    if (!welcomeCenterTile) return '';
    return welcomeCenterTile.value;
  }

  // Function to filter options based on user input
  private filterOptions(value: string): void {
    const filterValue = value.toLowerCase();

    if (this.friendlyNameImageTextList) {
      this.filterImageTextTiles = new Map(
        [...this.friendlyNameImageTextList.entries()].filter(([_, value]) => {
          return value.toLowerCase().includes(filterValue);
        }),
      );
    }
    if (this.friendlyNameGenericPopupList) {
      this.filterGenericPopupTiles = new Map(
        [...this.friendlyNameGenericPopupList.entries()].filter(([_, value]) => {
          return value.toLowerCase().includes(filterValue);
        }),
      );
    }
    if (this.friendlyNameDeeplinkList) {
      this.filterDeeplinkTiles = new Map(
        [...this.friendlyNameDeeplinkList.entries()].filter(([_, value]) => {
          return value.toLowerCase().includes(filterValue);
        }),
      );
    }
  }
}
