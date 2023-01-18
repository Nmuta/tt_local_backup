import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockTicketService } from '@services/zendesk';
import { of } from 'rxjs';
import faker from '@faker-js/faker';

import { SunriseComponent } from './sunrise.component';
import { createMockSunriseService, SunriseService } from '@services/sunrise';

describe('SunriseComponent - Ticket App', () => {
  let component: SunriseComponent;
  let fixture: ComponentFixture<SunriseComponent>;

  let mockStore: Store;
  let mockSunriseService: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSunriseService(), createMockTicketService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    mockSunriseService = TestBed.inject(SunriseService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: isInCorrectTitleRoute', () => {
    describe('When gameTitle matches Sunrise', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FH4);

        expect(result).toBeTruthy();
      });
    });
    describe('When gameTitle does not match Sunrise', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FH5);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('Method: requestPlayerIdentity$', () => {
    const gamertag = faker.name.firstName();

    it('should send request to mockSunriseService.getPlayerIdentity ', () => {
      component.requestPlayerIdentity$(gamertag);

      expect(mockSunriseService.getPlayerIdentity$).toHaveBeenCalledWith({ gamertag: gamertag });
    });
  });
});
