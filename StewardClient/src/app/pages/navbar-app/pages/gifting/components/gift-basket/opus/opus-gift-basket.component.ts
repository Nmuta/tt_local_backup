import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { Observable } from 'rxjs';
import { GiftBasketBaseComponent } from '../gift-basket.base.component';

/** Apollo gift basket. */
@Component({
  selector: 'opus-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OpusGiftBasketComponent),
      multi: true,
    },
  ],
})
export class OpusGiftBasketComponent extends GiftBasketBaseComponent<
  IdentityResultBeta
> {
  public title = GameTitleCodeName.FH3;

  constructor() {
    super();
  }

  /** The master inventory store select. */
  public masterInventorySelect$(): Observable<never> {
    return;
  }
}
