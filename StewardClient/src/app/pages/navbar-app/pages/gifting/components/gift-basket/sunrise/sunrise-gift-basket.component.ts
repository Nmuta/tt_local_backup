import { Component, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { Store } from '@ngxs/store';
import { GetSunriseMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { Observable } from 'rxjs';
import { GiftBasketBaseComponent } from '../gift-basket.base.component';

/** Apollo gift basket. */
@Component({
  selector: 'sunrise-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SunriseGiftBasketComponent),
      multi: true,
    },
  ],
})
export class SunriseGiftBasketComponent extends GiftBasketBaseComponent<
  IdentityResultBeta
> implements OnChanges{
  public title = GameTitleCodeName.FH4;

  constructor(protected readonly store: Store) {
    super();
  }

  /** The master inventory store select. */
  public masterInventorySelect$(): Observable<SunriseMasterInventory> {
    return this.store.select(MasterInventoryListMemoryState.sunriseMasterInventory);
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if(changes?.playerIdentities?.currentValue?.length > 0) {
      this.store.dispatch(new GetSunriseMasterInventoryList());
    }
  }
}
