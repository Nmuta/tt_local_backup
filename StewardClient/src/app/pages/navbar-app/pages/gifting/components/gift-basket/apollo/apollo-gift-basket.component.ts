import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { Observable, of } from 'rxjs';
import { GiftBasketBaseComponent } from '../gift-basket.base.component';

/** Apollo gift basket. */
@Component({
  selector: 'apollo-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApolloGiftBasketComponent),
      multi: true,
    },
  ],
})
export class ApolloGiftBasketComponent extends GiftBasketBaseComponent<
  IdentityResultBeta
> {
  public title = GameTitleCodeName.FM7;

  constructor() {
    super();
  }

  /** The dispatch action to get the master inventory. */
  public dispatchGetMasterInventoryAction(): void {
    // Empty
  }

  /** The master inventory store select. */
  public masterInventorySelect$(): Observable<GravityMasterInventoryLists | SunriseMasterInventory> {
    return of(null);
  }
}
