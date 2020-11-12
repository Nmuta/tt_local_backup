import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerDetailsComponent } from './sunrise-player-details.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { of } from 'rxjs';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { SunrisePlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/gamertag/details';

describe('SunrisePlayerDetailsComponent', () => {
  let mockSunriseService: SunriseService;

  let fixture: ComponentFixture<SunrisePlayerDetailsComponent>;
  let component: SunrisePlayerDetailsComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [SunrisePlayerDetailsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockWindowService(), createMockMsalService(), createMockSunriseService()],
      }).compileComponents();

      const injector = getTestBed();
      mockSunriseService = injector.inject(SunriseService);

      fixture = TestBed.createComponent(SunrisePlayerDetailsComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method makeRequest$:', () => {
    const expectedGamertag = 'test-gamertag';
    beforeEach(() => {
      component.gamertag = expectedGamertag;
      mockSunriseService.getPlayerDetailsByGamertag = jasmine
        .createSpy('getPlayerDetailsByGamertag')
        .and.returnValue(of(SunrisePlayerGamertagDetailsFakeApi.make()));
    });
    it('should return apollo player details request observable', () => {
      const apolloPlayerDetailsObs = component.makeRequest$();
      apolloPlayerDetailsObs.subscribe(() => {
        /* nothing */
      });

      expect(mockSunriseService.getPlayerDetailsByGamertag).toHaveBeenCalledWith(expectedGamertag);
    });
  });
});
