import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@components/base-component/base.component';
import { CreateLocalizedStringContract } from '@components/localization/create-localized-string/create-localized-string.component';
import { GameTitle } from '@models/enums';
import { PullRequest, PullRequestSubject } from '@models/git-operation';
import { LocalizedStringData } from '@models/localization';
import { FriendlyNameMap, TileType } from '@models/welcome-center';
import { SteelheadGitOperationService } from '@services/api-v2/steelhead/git-operation/steelhead-git-operation.service';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadDeeplinkTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/deeplink/steelhead-deeplink-tiles.service';
import { SteelheadGenericPopupTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/generic-popup/steelhead-generic-popup-tiles.service';
import { SteelheadImageTextTileService } from '@services/api-v2/steelhead/welcome-center-tiles/world-of-forza/image-text/steelhead-image-text-tiles.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep } from 'lodash';
import { combineLatest, Observable, takeUntil } from 'rxjs';

type PullRequestTableData = PullRequest & {
  monitor: ActionMonitor;
};

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
  public isInEditMode: boolean = false;
  public currentWelcomeCenterTile;
  public existingPullRequestList = new MatTableDataSource<PullRequestTableData>();
  public tileTypes = TileType;
  public columnsToDisplay = ['title', 'creationDate', 'actions'];

  public formControls = {
    selectedWelcomeCenterTile: new FormControl(null, [Validators.required]),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  public readonly permAttribute = PermAttributeName.UpdateWelcomeCenterTiles;

  constructor(
    steelheadLocalizationService: SteelheadLocalizationService,
    private readonly steelheadImageTextTileService: SteelheadImageTextTileService,
    private readonly steelheadGenericPopupTileService: SteelheadGenericPopupTileService,
    private readonly steelheadDeeplinkTileService: SteelheadDeeplinkTileService,
    private readonly steelheadGitOperationService: SteelheadGitOperationService,
  ) {
    super();

    this.localizationCreationServiceContract = {
      gameTitle: this.gameTitle,
      postStringForLocalization$(localizedStringData: LocalizedStringData): Observable<void> {
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
        this.friendlyNameImageTextList = imageTextTiles;
        this.friendlyNameGenericPopupList = genericPopupTiles;
        this.friendlyNameDeeplinkList = deeplinkTiles;
      });

    this.getActivePullRequests();
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
        .getImageTextTile$(event.source.value)
        .pipe(this.getTileActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(welcomeCenterTile => {
          this.currentWelcomeCenterTile = welcomeCenterTile;
        });
    } else if (tileType == TileType.GenericPopup) {
      this.steelheadGenericPopupTileService
        .getGenericPopupTile$(event.source.value)
        .pipe(this.getTileActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(welcomeCenterTile => {
          this.currentWelcomeCenterTile = welcomeCenterTile;
        });
    } else if (tileType == TileType.Deeplink) {
      this.steelheadDeeplinkTileService
        .getDeeplinkTile$(event.source.value)
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

  /** Toggle the form to edit mode, enabling all the fields. */
  public toggleEditMode(): void {
    this.isInEditMode = true;
  }

  /** Called when a child component emit a new pull request creation. Adds the pull request to the table. */
  public addPullRequest(pullRequest: PullRequest) {
    this.isInEditMode = false;
    this.existingPullRequestList.data.unshift({
      ...pullRequest,
      monitor: new ActionMonitor(`Abandon pull request: ${pullRequest.id}`),
    } as PullRequestTableData);
    this.existingPullRequestList._updateChangeSubscription();
  }

  /** Send a request to github to abandon a Pull Request. */
  public abandonPullRequest(entry: PullRequestTableData): void {
    entry.monitor = entry.monitor.repeat();
    this.steelheadGitOperationService
      .abandonPullRequest$(entry.id)
      .pipe(entry.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        const index = this.existingPullRequestList.data.indexOf(entry);
        this.existingPullRequestList.data.splice(index, 1);
        this.existingPullRequestList._updateChangeSubscription();
      });
  }

  /** Get and display the current active pull request. */
  private getActivePullRequests(): void {
    this.getPullRequests = this.getPullRequests.repeat();
    this.steelheadGitOperationService
      .getActivePullRequests$(PullRequestSubject.WorldOfForzaTile)
      .pipe(this.getPullRequests.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(result => {
        this.existingPullRequestList.data = result.map(pullrequest => {
          return {
            ...pullrequest,
            monitor: new ActionMonitor(`Abandon pull request: ${pullrequest.id}`),
          } as PullRequestTableData;
        });
      });
  }
}
