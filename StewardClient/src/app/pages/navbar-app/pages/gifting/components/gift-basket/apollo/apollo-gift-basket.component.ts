import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApolloMasterInventory } from '@models/apollo';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { GetApolloMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
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
export class ApolloGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultBeta>
  implements OnInit {
  public title = GameTitleCodeName.FM7;

  constructor(protected readonly store: Store, protected readonly formBuilder: FormBuilder) {
    super(formBuilder);
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    this.store.dispatch(new GetApolloMasterInventoryList()).subscribe(() => {
      this.isLoading = false;
      const apolloMasterInventory = this.store.selectSnapshot<ApolloMasterInventory>(
        MasterInventoryListMemoryState.apolloMasterInventory,
      );
      this.masterInventory = apolloMasterInventory;
    });
  }
}
