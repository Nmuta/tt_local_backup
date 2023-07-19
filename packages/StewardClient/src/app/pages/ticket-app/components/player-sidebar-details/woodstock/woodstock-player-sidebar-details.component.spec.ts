import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayerSidebarDetailsComponent } from './woodstock-player-sidebar-details.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalServices } from '@shared/mocks/msal.service.mock';
import { of } from 'rxjs';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { WoodstockPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/gamertag/details';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('WoodstockPlayerSidebarDetailsComponent', () => {
  let mockWoodstockService: WoodstockService;

  let fixture: ComponentFixture<WoodstockPlayerSidebarDetailsComponent>;
  let component: WoodstockPlayerSidebarDetailsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [WoodstockPlayerSidebarDetailsComponent, HumanizePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWindowService(),
        ...createMockMsalServices(),
        createMockWoodstockService(),
        createMockLoggerService(),
      ],
    }).compileComponents();

    const injector = getTestBed();
    mockWoodstockService = injector.inject(WoodstockService);

    fixture = TestBed.createComponent(WoodstockPlayerSidebarDetailsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method makeRequest$:', () => {
    const expectedGamertag = 'test-gamertag';
    beforeEach(() => {
      component.gamertag = expectedGamertag;
      mockWoodstockService.getPlayerDetailsByGamertag$ = jasmine
        .createSpy('getPlayerDetailsByGamertag')
        .and.returnValue(of(WoodstockPlayerGamertagDetailsFakeApi.make()));
    });
    it('should return apollo player details request observable', () => {
      const apolloPlayerDetailsObs = component.makeRequest$();
      apolloPlayerDetailsObs.subscribe(() => {
        /* nothing */
      });

      expect(mockWoodstockService.getPlayerDetailsByGamertag$).toHaveBeenCalledWith(
        expectedGamertag,
      );
    });
  });
});
