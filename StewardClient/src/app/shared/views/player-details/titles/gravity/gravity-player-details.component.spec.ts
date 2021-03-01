import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { GravityPlayerDetailsComponent } from './gravity-player-details.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { createMockGravityService, GravityService } from '@services/gravity';
import { of } from 'rxjs';
import { GravityPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/gravity/player/gamertag/details';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('GravityPlayerDetailsComponent', () => {
  let mockGravityService: GravityService;

  let fixture: ComponentFixture<GravityPlayerDetailsComponent>;
  let component: GravityPlayerDetailsComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [GravityPlayerDetailsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockGravityService(),
          createMockLoggerService(),
        ],
      }).compileComponents();

      const injector = getTestBed();
      mockGravityService = injector.inject(GravityService);

      fixture = TestBed.createComponent(GravityPlayerDetailsComponent);
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
      mockGravityService.getPlayerDetailsByGamertag = jasmine
        .createSpy('getPlayerDetailsByGamertag')
        .and.returnValue(of(GravityPlayerGamertagDetailsFakeApi.make()));
    });
    it('should return apollo player details request observable', () => {
      const apolloPlayerDetailsObs = component.makeRequest$();
      apolloPlayerDetailsObs.subscribe(_data => {
        /* nothing */
      });

      expect(mockGravityService.getPlayerDetailsByGamertag).toHaveBeenCalledWith(expectedGamertag);
    });
  });
});
