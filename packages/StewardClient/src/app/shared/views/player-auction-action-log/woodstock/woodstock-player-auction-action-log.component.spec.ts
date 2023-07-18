import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { createMockWoodstockService } from '@services/woodstock';

import { WoodstockPlayerAuctionActionLogComponent } from './woodstock-player-auction-action-log.component';

describe('WoodstockPlayerAuctionActionLogComponent', () => {
  let component: WoodstockPlayerAuctionActionLogComponent;
  let fixture: ComponentFixture<WoodstockPlayerAuctionActionLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockPlayerAuctionActionLogComponent],
      providers: [createMockWoodstockService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockPlayerAuctionActionLogComponent);
    component = fixture.componentInstance;
    component.identity = WoodstockPlayersIdentitiesFakeApi.make([{ xuid: fakeBigNumber() }])[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
