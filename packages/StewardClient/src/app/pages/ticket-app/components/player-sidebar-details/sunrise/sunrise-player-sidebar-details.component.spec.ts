import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerSidebarDetailsComponent } from './sunrise-player-sidebar-details.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalServices } from '@shared/mocks/msal.service.mock';
import { of } from 'rxjs';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { SunrisePlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/gamertag/details';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('SunrisePlayerSidebarDetailsComponent', () => {
  let mockSunriseService: SunriseService;

  let fixture: ComponentFixture<SunrisePlayerSidebarDetailsComponent>;
  let component: SunrisePlayerSidebarDetailsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [SunrisePlayerSidebarDetailsComponent, HumanizePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWindowService(),
        ...createMockMsalServices(),
        createMockSunriseService(),
        createMockLoggerService(),
      ],
    }).compileComponents();

    const injector = getTestBed();
    mockSunriseService = injector.inject(SunriseService);

    fixture = TestBed.createComponent(SunrisePlayerSidebarDetailsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method makeRequest$:', () => {
    const expectedGamertag = 'test-gamertag';
    beforeEach(() => {
      component.gamertag = expectedGamertag;
      mockSunriseService.getPlayerDetailsByGamertag$ = jasmine
        .createSpy('getPlayerDetailsByGamertag')
        .and.returnValue(of(SunrisePlayerGamertagDetailsFakeApi.make()));
    });
    it('should return apollo player details request observable', () => {
      const apolloPlayerDetailsObs = component.makeRequest$();
      apolloPlayerDetailsObs.subscribe(() => {
        /* nothing */
      });

      expect(mockSunriseService.getPlayerDetailsByGamertag$).toHaveBeenCalledWith(expectedGamertag);
    });
  });
});
