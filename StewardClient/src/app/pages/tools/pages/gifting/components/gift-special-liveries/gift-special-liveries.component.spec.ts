import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LspGroup } from '@models/lsp-group';
import { BigNumber } from 'bignumber.js';
import { EMPTY } from 'rxjs';

import { GiftSpecialLiveriesComponent } from './gift-special-liveries.component';

describe('GiftSpecialLiveryComponent', () => {
  let component: GiftSpecialLiveriesComponent;
  let fixture: ComponentFixture<GiftSpecialLiveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GiftSpecialLiveriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftSpecialLiveriesComponent);
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
