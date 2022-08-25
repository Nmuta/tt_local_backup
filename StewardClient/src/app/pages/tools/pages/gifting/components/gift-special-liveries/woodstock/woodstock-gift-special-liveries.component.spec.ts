import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LspGroup } from '@models/lsp-group';
import { BigNumber } from 'bignumber.js';
import { EMPTY } from 'rxjs';

import { WoodstockGiftSpecialLiveriesComponent } from './woodstock-gift-special-liveries.component';

describe('WoodstockGiftSpecialLiveryComponent', () => {
  let component: WoodstockGiftSpecialLiveriesComponent;
  let fixture: ComponentFixture<WoodstockGiftSpecialLiveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockGiftSpecialLiveriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockGiftSpecialLiveriesComponent);
    component = fixture.componentInstance;
    component.contract = {
      getLivery$: (_giftReason: string) => EMPTY,
      giftLiveriesToLspGroup$: (_giftReason: string, _liveryIds: string[], _lspGroup: LspGroup) =>
        EMPTY,
      giftLiveryToPlayers$: (_giftReason: string, _liveryIds: string[], _xuids: BigNumber[]) =>
        EMPTY,
      liveries: [],
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
