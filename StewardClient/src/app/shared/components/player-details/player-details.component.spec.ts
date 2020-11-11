import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
  waitForAsync,
} from '@angular/core/testing';
import { environment } from '@environments/environment';
import { PlayerDetailsBaseComponent } from './player-details.base.component';
import {
  WindowService,
  createMockWindowService,
} from '@shared/services/window';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { createMockGravityService, GravityService } from '@services/gravity';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { inRange } from 'lodash';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { Observable, of, throwError } from 'rxjs';
import { createMockMockOpusService, OpusService } from '@services/opus';
import { ApolloService, createMockMockApolloService } from '@services/apollo';

describe('PlayerDetailsComponent', () => {
  let mockGravityService: GravityService;
  let mockSunriseService: SunriseService;
  let mockApolloService: ApolloService;
  let mockOpusService: OpusService;

  let fixture: ComponentFixture<PlayerDetailsBaseComponent<any>>;
  let component: PlayerDetailsBaseComponent<any>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [PlayerDetailsBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockGravityService(),
          createMockSunriseService(),
          createMockMockApolloService(),
          createMockMockOpusService(),
        ],
      }).compileComponents();

      const injector = getTestBed();
      mockGravityService = injector.inject(GravityService);
      mockSunriseService = injector.inject(SunriseService);
      mockApolloService = injector.inject(ApolloService);
      mockOpusService = injector.inject(OpusService);

      fixture = TestBed.createComponent(PlayerDetailsBaseComponent as any);
      component = fixture.debugElement.componentInstance;

      component.makeRequest$ = jasmine
        .createSpy('makeRequest$')
        .and.returnValue(of({}));
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method ngOnChanges:', () => {
    it('Should call service for player details', () => {
      component.ngOnChanges();

      expect(component.makeRequest$).toHaveBeenCalled();
    });
    it(
      'Should set isLoading to false',
      waitForAsync(() => {
        component.ngOnChanges();
        expect(component.isLoading).toBeFalsy();
      })
    );
    describe('And api returns player details', () => {
      const expectedPlayerDetails = {
        xuid: '123456789',
        gamertag: 'test-gamertag',
      };
      beforeEach(() => {
        component.makeRequest$ = jasmine
          .createSpy('makeRequest$')
          .and.returnValue(of(expectedPlayerDetails));
      });
      it('Should set playerDetails expected response', () => {
        component.ngOnChanges();
        expect(component.playerDetails).toEqual(expectedPlayerDetails);
      });
    });
    describe('And api returns error', () => {
      const expectedError = { message: 'test-error' };
      beforeEach(() => {
        component.makeRequest$ = jasmine
          .createSpy('getPlayerDetailsByGamertag')
          .and.returnValue(throwError(expectedError));
      });
      it('Should set playerDetails expected response', () => {
        component.ngOnChanges();
        expect(component.playerDetails).toBeUndefined();
        expect(component.loadError).toEqual(expectedError);
      });
    });
  });
});
