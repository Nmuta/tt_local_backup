import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { of } from 'rxjs';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SteelheadPlayerGameDetailsComponent } from './steelhead-player-game-details.component';
import { SteelheadPlayerGameDetailsService } from '@services/api-v2/steelhead/player/game-details/steelhead-player-game-details.service';
import { createMockSteelheadPlayerGameDetailsService } from '@services/api-v2/steelhead/player/game-details/steelhead-player-game-details.service.mock';

describe('SteelheadPlayerGameDetailsComponent', () => {
  let component: SteelheadPlayerGameDetailsComponent;
  let fixture: ComponentFixture<SteelheadPlayerGameDetailsComponent>;

  let mockSteelheadPlayerGameDetailsService: SteelheadPlayerGameDetailsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadPlayerGameDetailsComponent],
      imports: [PipesModule],
      providers: [createMockSteelheadPlayerGameDetailsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadPlayerGameDetailsComponent);
    component = fixture.componentInstance;
    mockSteelheadPlayerGameDetailsService = TestBed.inject(SteelheadPlayerGameDetailsService);
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
      mockSteelheadPlayerGameDetailsService.getUserGameDetails$ = jasmine
        .createSpy('getUserGameDetails$')
        .and.returnValue(of({}));
    });

    it('should call steelheadPlayerService.getUserGameDetails', () => {
      const expectedXuid = component.identity.xuid;
      component.service.getPlayerGameDetails$(component.identity.xuid);

      expect(mockSteelheadPlayerGameDetailsService.getUserGameDetails$).toHaveBeenCalledTimes(1);
      expect(mockSteelheadPlayerGameDetailsService.getUserGameDetails$).toHaveBeenCalledWith(
        expectedXuid,
      );
    });
  });
});
