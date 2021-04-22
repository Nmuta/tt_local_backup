import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { SteelheadPlayerSidebarDetailsComponent } from './steelhead-player-sidebar-details.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { of } from 'rxjs';
import { SteelheadService, createMockSteelheadService } from '@services/steelhead';
import { SteelheadPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/gamertag/details';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('SteelheadPlayerSidebarDetailsComponent', () => {
  let mockSteelheadService: SteelheadService;

  let fixture: ComponentFixture<SteelheadPlayerSidebarDetailsComponent>;
  let component: SteelheadPlayerSidebarDetailsComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [SteelheadPlayerSidebarDetailsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockSteelheadService(),
          createMockLoggerService(),
        ],
      }).compileComponents();

      const injector = getTestBed();
      mockSteelheadService = injector.inject(SteelheadService);

      fixture = TestBed.createComponent(SteelheadPlayerSidebarDetailsComponent);
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
      mockSteelheadService.getPlayerDetailsByGamertag = jasmine
        .createSpy('getPlayerDetailsByGamertag')
        .and.returnValue(of(SteelheadPlayerGamertagDetailsFakeApi.make()));
    });
    it('should return steelhead player details request observable', () => {
      const steelheadPlayerDetailsObs = component.makeRequest$();
      steelheadPlayerDetailsObs.subscribe(_data => {
        /* nothing */
      });

      expect(mockSteelheadService.getPlayerDetailsByGamertag).toHaveBeenCalledWith(
        expectedGamertag,
      );
    });
  });
});
