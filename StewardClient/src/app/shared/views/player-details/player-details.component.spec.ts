import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerDetailsBaseComponent } from './player-details.base.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { createMockGravityService } from '@services/gravity';
import { createMockSunriseService } from '@services/sunrise';
import { of, throwError } from 'rxjs';
import { createMockOpusService } from '@services/opus';
import { createMockApolloService } from '@services/apollo';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('PlayerDetailsComponent', () => {
  let fixture: ComponentFixture<PlayerDetailsBaseComponent<never>>;
  let component: PlayerDetailsBaseComponent<never>;

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
          createMockApolloService(),
          createMockOpusService(),
          createMockLoggerService(),
        ],
      }).compileComponents();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fixture = TestBed.createComponent(PlayerDetailsBaseComponent as any);
      component = fixture.debugElement.componentInstance;

      component.makeRequest$ = jasmine.createSpy('makeRequest$').and.returnValue(of({}));
    }),
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
      }),
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
