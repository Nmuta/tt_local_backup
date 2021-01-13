import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { Observable } from 'rxjs';
import { GiftBasketBaseComponent } from '../gift-basket.base.component';

/** Gravity gift basket. */
@Component({
  selector: 'gravity-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GravityGiftBasketComponent),
      multi: true,
    },
  ],
})
export class GravityGiftBasketComponent extends GiftBasketBaseComponent<
  IdentityResultBeta
> {
  public title = GameTitleCodeName.Street;

  constructor(protected readonly store: Store) {
    super();
  }

  /** The master inventory store select. */
  public masterInventorySelect$(): Observable<GravityMasterInventoryLists> {
    return this.store.select(MasterInventoryListMemoryState.gravityMasterInventory);
  }
}
