import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PlayFabProfile } from '@services/api-v2/woodstock/players/playfab/woodstock-players-playfab.service';
import BigNumber from 'bignumber.js';
import { PlayFabTransactionHistoryServiceContract } from './components/playfab-transaction-history/playfab-transaction-history.component';
import { PlayFabInventoryServiceContract } from './components/playfab-inventory/playfab-inventory.component';
import { PlayFabCollectionId } from '@models/playfab';
import { cloneDeep } from 'lodash';

/** Service contract for the PlayFabPlayerToolsComponent. */
export interface PlayFabPlayerToolsServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets PlayFab Player Id. */
  getPlayFabProfile$(xuid: BigNumber): Observable<PlayFabProfile>;
  /** PlayFab inventory service contract */
  inventoryService: PlayFabInventoryServiceContract;
  /** PlayFab transaction history service contract */
  transactionHistoryService: PlayFabTransactionHistoryServiceContract;
}

/** Component that wraps PlayFab tools for a specific player. */
@Component({
  selector: 'playfab-player-tools',
  templateUrl: './playfab-player-tools.component.html',
  styleUrls: ['./playfab-player-tools.component.scss'],
})
export class PlayFabPlayerToolsComponent extends BaseComponent implements OnChanges {
  /** The component service contract */
  @Input() service: PlayFabPlayerToolsServiceContract;

  /** Player XUID to build playfab tools around. */
  @Input() xuid: BigNumber;

  public readonly PlayFabCollectionId = PlayFabCollectionId;
  public collectionId: PlayFabCollectionId = PlayFabCollectionId.Default;

  public playfabProfile: PlayFabProfile;
  public getPlayFabProfileMonitor = new ActionMonitor('Get PlayFab player id');

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Gets the service contract for PlayFab inventory component. */
  public get inventoryService(): PlayFabInventoryServiceContract {
    return this.service.inventoryService;
  }

  /** Gets the service contract for PlayFab transaction history component. */
  public get transactionHistoryService(): PlayFabTransactionHistoryServiceContract {
    return this.service.transactionHistoryService;
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayFabPlayerToolsComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for PlayFab player tools component.');
    }

    if (!!changes.xuid && !!this.xuid) {
      this.getPlayFabProfile();
    }
  }

  /** Logic when inventory item amounts are changed. */
  public inventoryChangeEvent(): void {
    // Fake an ngOnChange event for each underlying tool by cloning playfabProfile
    this.playfabProfile = cloneDeep(this.playfabProfile);
  }


  private getPlayFabProfile(): void {
    this.getPlayFabProfileMonitor = this.getPlayFabProfileMonitor.repeat();
    this.service
      .getPlayFabProfile$(this.xuid)
      .pipe(this.getPlayFabProfileMonitor.monitorSingleFire())
      .subscribe(playfabProfile => {
        this.playfabProfile = playfabProfile;
      });
  }
}
