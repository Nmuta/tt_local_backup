import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockTicketService } from '@services/zendesk';
import { of } from 'rxjs';
import faker from 'faker';

import { WoodstockComponent } from './woodstock.component';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';

describe('WoodstockComponent - Ticket App', () => {
  let component: WoodstockComponent;
  let fixture: ComponentFixture<WoodstockComponent>;

  let mockStore: Store;
  let mockWoodstockService: WoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockWoodstockService(), createMockTicketService()],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    mockWoodstockService = TestBed.inject(WoodstockService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: isInCorrectTitleRoute', () => {
    describe('When gameTitle matches Woodstock', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FH5);

        expect(result).toBeTruthy();
      });
    });
    describe('When gameTitle does not match Gravity', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.Street);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('Method: requestPlayerIdentity$', () => {
    const gamertag = faker.name.firstName();

    it('should send request to mockGravityService.getPlayerIdentity ', () => {
      component.requestPlayerIdentity$(gamertag);

      expect(mockWoodstockService.getPlayerIdentity$).toHaveBeenCalledWith({ gamertag: gamertag });
    });
  });
});
