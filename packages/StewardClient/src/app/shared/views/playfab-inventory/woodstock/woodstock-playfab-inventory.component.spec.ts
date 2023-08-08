import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayFabInventoryComponent } from './woodstock-playfab-inventory.component';
import { createMockWoodstockPlayFabVouchersService } from '@services/api-v2/woodstock/playfab/vouchers/woodstock-playfab-vouchers.service.mock';
import { createMockWoodstockPlayFabPlayerInventoryService } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service.mock';

describe('WoodstockPlayFabInventoryComponent', () => {
  let component: WoodstockPlayFabInventoryComponent;
  let fixture: ComponentFixture<WoodstockPlayFabInventoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [WoodstockPlayFabInventoryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWoodstockPlayFabPlayerInventoryService(),
        createMockWoodstockPlayFabVouchersService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockPlayFabInventoryComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
