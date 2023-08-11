import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayFabPlayerToolsComponent } from './woodstock-playfab-player-tools.component';
import { createMockWoodstockPlayersPlayFabService } from '@services/api-v2/woodstock/players/playfab/woodstock-players-playfab.service.mock';
import { createMockWoodstockPlayFabPlayerInventoryService } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service.mock';
import { createMockWoodstockPlayFabVouchersService } from '@services/api-v2/woodstock/playfab/vouchers/woodstock-playfab-vouchers.service.mock';

describe('WoodstockPlayFabPlayerToolsComponent', () => {
  let component: WoodstockPlayFabPlayerToolsComponent;
  let fixture: ComponentFixture<WoodstockPlayFabPlayerToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [WoodstockPlayFabPlayerToolsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWoodstockPlayersPlayFabService(),
        createMockWoodstockPlayFabPlayerInventoryService(),
        createMockWoodstockPlayFabVouchersService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockPlayFabPlayerToolsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
