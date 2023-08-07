import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayFabTransactionHistoryComponent } from './woodstock-playfab-transaction-history.component';
import { createMockWoodstockPlayFabVouchersService } from '@services/api-v2/woodstock/playfab/vouchers/woodstock-playfab-vouchers.service.mock';
import { createMockWoodstockPlayFabPlayerInventoryService } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service.mock';

describe('WoodstockPlayFabTransactionHistoryComponent', () => {
  let component: WoodstockPlayFabTransactionHistoryComponent;
  let fixture: ComponentFixture<WoodstockPlayFabTransactionHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [WoodstockPlayFabTransactionHistoryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWoodstockPlayFabPlayerInventoryService(),
        createMockWoodstockPlayFabVouchersService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockPlayFabTransactionHistoryComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
