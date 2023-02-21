import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerSidebarDetailsBaseComponent } from './player-sidebar-details.base.component';
import { createMockWindowService } from '@shared/services/window';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalServices } from '@shared/mocks/msal.service.mock';
import { createMockSunriseService } from '@services/sunrise';
import { of, throwError } from 'rxjs';
import { createMockOpusService } from '@services/opus';
import { createMockApolloService } from '@services/apollo';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import faker from '@faker-js/faker';

describe('PlayerSidebarDetailsBaseComponent', () => {
  let fixture: ComponentFixture<PlayerSidebarDetailsBaseComponent<never>>;
  let component: PlayerSidebarDetailsBaseComponent<never>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [PlayerSidebarDetailsBaseComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWindowService(),
        ...createMockMsalServices(),
        createMockSunriseService(),
        createMockApolloService(),
        createMockOpusService(),
        createMockLoggerService(),
      ],
    }).compileComponents();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fixture = TestBed.createComponent(PlayerSidebarDetailsBaseComponent as any);
    component = fixture.debugElement.componentInstance;

    component.makeRequest$ = jasmine.createSpy('makeRequest$').and.returnValue(of({}));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method ngOnChanges:', () => {
    describe('When gamertag is undefined', () => {
      beforeEach(() => {
        component.gamertag = undefined;
      });

      it('Should not call service for player details', () => {
        component.ngOnChanges();

        expect(component.makeRequest$).not.toHaveBeenCalled();
      });
    });

    describe('When gamertag is defined', () => {
      beforeEach(() => {
        component.gamertag = faker.name.firstName();
      });

      it('Should call service for player details', () => {
        component.ngOnChanges();

        expect(component.makeRequest$).toHaveBeenCalled();
      });
      it('Should set isLoading to false', waitForAsync(() => {
        component.ngOnChanges();
        expect(component.isLoading).toBeFalsy();
      }));
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
});
