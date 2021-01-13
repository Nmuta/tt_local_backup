import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { GameTitleCodeName } from '@models/enums';
import { Observable } from 'rxjs/internal/Observable';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';

type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;
type MasterInventoryUnion = GravityMasterInventoryLists | SunriseMasterInventory;

/** The base gift-basket component. */
@Component({
  template: '',
})
export abstract class GiftBasketBaseComponent<T extends IdentityResultUnion>
  extends BaseComponent
  implements OnInit {
  @Input() public playerIdentities: T[];
  @Input() public gameSettings: MasterInventoryUnion;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  /** Game title */
  public abstract title: GameTitleCodeName;

  constructor() {
    super();
  }

  /** Parent component to implement */
  public abstract dispatchGetMasterInventoryAction(): void;

  /** Parent component to implement */
  public abstract masterInventorySelect$(): Observable<MasterInventoryUnion>;

  /** Angular lifecycle */
  public ngOnInit(): void {
    this.isLoading = false;

    const masterInventory$ = this.masterInventorySelect$();
    masterInventory$.pipe(
      takeUntil(this.onDestroy$),
      filter(data => {
        switch(this.title) {
          case GameTitleCodeName.Street:
            console.log(data);
            return false;
          case GameTitleCodeName.FH4:
            console.log(data);
            return false;
          default:
            return false;
        }      
      }),
      tap((data: MasterInventoryUnion) => {
        console.log('testing');
      }),
    ).subscribe();
  }
}
