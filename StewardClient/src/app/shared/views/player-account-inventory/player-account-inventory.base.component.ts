import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultUnion } from '@models/identity-query.model';
import { SunrisePlayerAccountInventory } from '@models/sunrise/sunrise-player-account-inventory.model';
import { WoodstockPlayerAccountInventory } from '@models/woodstock/woodstock-player-account-inventory.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

export type AccountInventoryUnion = SunrisePlayerAccountInventory | WoodstockPlayerAccountInventory;

/** Retreives and displays a player account inventory by XUID. */
@Component({
  template: '',
})
export abstract class PlayerAccountInventoryBaseComponent<T extends AccountInventoryUnion>
  extends BaseComponent
  implements OnChanges
{
  @Input() public identity?: IdentityResultUnion;

  public accountInventory: T;
  public getMonitor = new ActionMonitor('GET Account Inventory');

  public abstract gameTitle: GameTitleCodeName;
  public abstract getPlayerAccountInventoryByXuid$(xuid: BigNumber): Observable<T>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.identity || !this.identity?.xuid) {
      this.accountInventory = undefined;
      return;
    }

    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
    const getPlayerAccountInventoryByXuid$ = this.getPlayerAccountInventoryByXuid$(
      this.identity.xuid,
    );
    getPlayerAccountInventoryByXuid$
      .pipe(
        take(1),
        this.getMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      )
      .subscribe(accountInventory => {
        this.accountInventory = accountInventory;
      });
  }
}
