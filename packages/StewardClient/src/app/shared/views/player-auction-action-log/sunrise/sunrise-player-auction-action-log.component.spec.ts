import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { createMockSunriseService } from '@services/sunrise';

import { SunrisePlayerAuctionActionLogComponent } from './sunrise-player-auction-action-log.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SunrisePlayerAuctionActionLogComponent', () => {
  let component: SunrisePlayerAuctionActionLogComponent;
  let fixture: ComponentFixture<SunrisePlayerAuctionActionLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [SunrisePlayerAuctionActionLogComponent],
        providers: [createMockSunriseService()],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunrisePlayerAuctionActionLogComponent);
    component = fixture.componentInstance;
    component.identity = SunrisePlayersIdentitiesFakeApi.make([{ xuid: fakeBigNumber() }])[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
