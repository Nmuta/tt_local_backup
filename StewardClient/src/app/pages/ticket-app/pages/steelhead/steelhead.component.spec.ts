import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { NgxsModule, Store } from '@ngxs/store';
import { SteelheadService, createMockSteelheadService } from '@services/steelhead';
import { createMockTicketService } from '@services/zendesk';
import { of } from 'rxjs';
import faker from '@faker-js/faker';

import { SteelheadComponent } from './steelhead.component';

describe('SteelheadComponent - Ticket App', () => {
  let component: SteelheadComponent;
  let fixture: ComponentFixture<SteelheadComponent>;

  let mockStore: Store;
  let mockSteelheadService: SteelheadService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadService(), createMockTicketService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    mockSteelheadService = TestBed.inject(SteelheadService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: isInCorrectTitleRoute', () => {
    describe('When gameTitle matches Steelhead', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FM8);

        expect(result).toBeTruthy();
      });
    });
    describe('When gameTitle does not match Steelhead', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FH4);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('Method: requestPlayerIdentity$', () => {
    const gamertag = faker.name.firstName();

    it('should send request to steelheadService.getPlayerIdentity ', () => {
      component.requestPlayerIdentity$(gamertag);

      expect(mockSteelheadService.getPlayerIdentity$).toHaveBeenCalledWith({ gamertag: gamertag });
    });
  });
});
