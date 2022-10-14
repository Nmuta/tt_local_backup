import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { of } from 'rxjs';
import { PipesModule } from '@shared/pipes/pipes.module';
import { WoodstockPlayerGameDetailsComponent } from './woodstock-player-game-details.component';
import { createMockWoodstockPlayerService } from '@services/api-v2/woodstock/player/woodstock-player.service.mock';
import { WoodstockPlayerService } from '@services/api-v2/woodstock/player/woodstock-player.service';

describe('WoodstockPlayerGameDetailsComponent', () => {
  let component: WoodstockPlayerGameDetailsComponent;
  let fixture: ComponentFixture<WoodstockPlayerGameDetailsComponent>;

  let mockWoodstockPlayerService: WoodstockPlayerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockPlayerGameDetailsComponent],
      imports: [PipesModule],
      providers: [createMockWoodstockPlayerService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockPlayerGameDetailsComponent);
    component = fixture.componentInstance;
    mockWoodstockPlayerService = TestBed.inject(WoodstockPlayerService);
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: getPlayerGameDetails', () => {
    beforeEach(() => {
      component.identity = {
        query: undefined,
        gamertag: faker.name.firstName(),
        xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
      };
      mockWoodstockPlayerService.getUserGameDetails$ = jasmine
        .createSpy('getUserGameDetails$')
        .and.returnValue(of({}));
    });

    it('should call woodstockPlayerService.getPlayerGameDetails', () => {
      const expectedXuid = component.identity.xuid;
      component.service.getPlayerGameDetails$(component.identity.xuid);

      expect(mockWoodstockPlayerService.getUserGameDetails$).toHaveBeenCalledTimes(1);
      expect(mockWoodstockPlayerService.getUserGameDetails$).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
