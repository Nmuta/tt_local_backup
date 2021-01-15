import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
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
export class ApolloGiftBasketComponent extends GiftBasketBaseComponent<IdentityResultBeta> {
  public title = GameTitleCodeName.FM7;
  public disableCard: boolean = true;
}
