import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
  waitForAsync,
} from '@angular/core/testing';
import { environment } from '@environments/environment';
import { PlayerDetailsComponent } from './player-details.component';
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
import { of, throwError } from 'rxjs';


describe('PlayerDetailsComponent', () => {
  let mockGravityService: GravityService;
  let mockSunriseService: SunriseService;


  let fixture: ComponentFixture<PlayerDetailsComponent>;
  let component: PlayerDetailsComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [PlayerDetailsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockGravityService(),
          createMockSunriseService()
        ],
      }).compileComponents();

      const injector = getTestBed();
      mockGravityService = injector.inject(GravityService);
      mockSunriseService = injector.inject(SunriseService);

      fixture = TestBed.createComponent(PlayerDetailsComponent);
      component = fixture.debugElement.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method ngOnChanges:', () => {
    describe('When gameTitle is null', () => {
      beforeEach(() => {
        component.gameTitle = null;
      });
      it('Should not call any services for player details', () => {
        component.ngOnChanges();

        expect(mockGravityService.getPlayerDetailsByGamertag).not.toHaveBeenCalled();
        expect(mockSunriseService.getPlayerDetailsByGamertag).not.toHaveBeenCalled();
      });
    });
    describe('When gameTitle is "Gravity"', () => {
      beforeEach(() => {
        component.gameTitle = 'Gravity';
      });

      describe('And gamertag is null', () => {
        beforeEach(() => {
          component.gamertag = null; 
        });
        it('Should not call gravity services for player details', () => {
          component.ngOnChanges();
  
          expect(mockGravityService.getPlayerDetailsByGamertag).not.toHaveBeenCalled();
        });
      });

      describe('And gamertag is valid', () => {
        let expectedGamertag = 'test-gamertag';
        beforeEach(() => {
          component.gamertag = expectedGamertag; 
        });
        it('Should call gravity service for player details', () => {
          component.ngOnChanges();
  
          expect(mockGravityService.getPlayerDetailsByGamertag).toHaveBeenCalledWith(expectedGamertag);
        });
        it('Should set isLoading to false', waitForAsync(() => {
          component.ngOnChanges();
          expect(component.isLoading).toBeFalsy();
        }));
        describe('And api returns player details', () => {
          let expectedPlayerDetails = { xuid: '123456789', gamertag: 'test-gamertag'};
          beforeEach(() => {
            mockGravityService.getPlayerDetailsByGamertag = jasmine.createSpy('getPlayerDetailsByGamertag')
              .and.returnValue(of(expectedPlayerDetails));; 
          });
          it('Should set playerDetails expected response', () => {
            component.ngOnChanges();
            expect(component.playerDetails).toEqual(expectedPlayerDetails);
          });
        });
        describe('And api returns error', () => {
          let expectedError = { message: 'test-error' };
          beforeEach(() => {
            mockGravityService.getPlayerDetailsByGamertag = jasmine.createSpy('getPlayerDetailsByGamertag')
              .and.returnValue(throwError(expectedError));; 
          });
          it('Should set playerDetails expected response', () => {
            component.ngOnChanges();
            expect(component.playerDetails).toBeUndefined();
            expect(component.loadError).toEqual(expectedError);
          });
        });
      });
    });
    describe('When gameTitle is "Sunrise"', () => {
      beforeEach(() => {
        component.gameTitle = 'Sunrise';
      });

      describe('And gamertag is null', () => {
        beforeEach(() => {
          component.gamertag = null;
        });
        it('Should not call sunrise services for player details', () => {
          component.ngOnChanges();
  
          expect(mockSunriseService.getPlayerDetailsByGamertag).not.toHaveBeenCalled();
        });
      });

      describe('And gamertag is valid', () => {
        let expectedGamertag = 'test-gamertag';
        beforeEach(() => {
          component.gamertag = expectedGamertag; 
        });
        it('Should call sunrise service for player details', () => {
          component.ngOnChanges();
          expect(mockSunriseService.getPlayerDetailsByGamertag).toHaveBeenCalledWith(expectedGamertag);
        });
        it('Should set isLoading to false', () => {
          component.ngOnChanges();
          expect(component.isLoading).toBeFalsy();
        });

        describe('And api returns player details', () => {
          let expectedPlayerDetails = { xuid: '123456789', gamertag: 'test-gamertag'};
          beforeEach(() => {
            mockSunriseService.getPlayerDetailsByGamertag = jasmine.createSpy('getPlayerDetailsByGamertag')
              .and.returnValue(of(expectedPlayerDetails));; 
          });
          it('Should set playerDetails expected response', () => {
            component.ngOnChanges();
            expect(component.playerDetails).toEqual(expectedPlayerDetails);
          });
        });
        describe('And api returns error', () => {
          let expectedError = { message: 'test-error' };
          beforeEach(() => {
            mockSunriseService.getPlayerDetailsByGamertag = jasmine.createSpy('getPlayerDetailsByGamertag')
              .and.returnValue(throwError(expectedError));; 
          });
          it('Should set playerDetails expected response', () => {
            component.ngOnChanges();
            expect(component.playerDetails).toBeUndefined();
            expect(component.loadError).toEqual(expectedError);
          });
        });
      });
    });
    // describe('When gameTitle is "Apollo"', () => {
    //   beforeEach(() => {
    //     component.gameTitle = 'Apollo';
    //   });

    //   describe('When gamertag is null', () => {
    //     beforeEach(() => {
    //       component.gamertag = null;
    //     });
    //   });
    // });
    // describe('When gameTitle is "Opus"', () => {
    //   beforeEach(() => {
    //     component.gameTitle = 'Opus';
    //   });

    //   describe('When gamertag is null', () => {
    //     beforeEach(() => {
    //       component.gamertag = null;
    //     });
    //   });
    // });
  });
});
