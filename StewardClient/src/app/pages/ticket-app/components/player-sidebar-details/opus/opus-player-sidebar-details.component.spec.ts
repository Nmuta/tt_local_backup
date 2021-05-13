import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { OpusPlayerSidebarDetailsComponent } from './opus-player-sidebar-details.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { of } from 'rxjs';
import { createMockOpusService, OpusService } from '@services/opus';
import { OpusPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/opus/player/gamertag/details';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('OpusPlayerSidebarDetailsComponent', () => {
  let mockOpusService: OpusService;

  let fixture: ComponentFixture<OpusPlayerSidebarDetailsComponent>;
  let component: OpusPlayerSidebarDetailsComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [OpusPlayerSidebarDetailsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockOpusService(),
          createMockLoggerService(),
        ],
      }).compileComponents();

      const injector = getTestBed();
      mockOpusService = injector.inject(OpusService);

      fixture = TestBed.createComponent(OpusPlayerSidebarDetailsComponent);
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
      mockOpusService.getPlayerDetailsByGamertag$ = jasmine
        .createSpy('getPlayerDetailsByGamertag')
        .and.returnValue(of(OpusPlayerGamertagDetailsFakeApi.make()));
    });
    it('should return apollo player details request observable', () => {
      const apolloPlayerDetailsObs = component.makeRequest$();
      apolloPlayerDetailsObs.subscribe(_data => {
        /* nothing */
      });

      expect(mockOpusService.getPlayerDetailsByGamertag$).toHaveBeenCalledWith(expectedGamertag);
    });
  });
});
