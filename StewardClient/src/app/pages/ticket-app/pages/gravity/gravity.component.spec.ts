import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockTicketService } from '@services/zendesk';
import { of } from 'rxjs';
import faker from 'faker';

import { GravityComponent } from './gravity.component';
import { createMockGravityService, GravityService } from '@services/gravity';

describe('GravityComponent - Ticket App', () => {
  let component: GravityComponent;
  let fixture: ComponentFixture<GravityComponent>;

  let mockStore: Store;
  let mockGravityService: GravityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockGravityService(), createMockTicketService()],
    }).compileComponents();

    fixture = TestBed.createComponent(GravityComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    mockGravityService = TestBed.inject(GravityService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: isInCorrectTitleRoute', () => {
    describe('When gameTitle matches Gravity', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.Street);

        expect(result).toBeTruthy();
      });
    });
    describe('When gameTitle does not match Gravity', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FH4);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('Method: requestPlayerIdentity$', () => {
    const gamertag = faker.name.firstName();

    it('should send request to mockGravityService.getPlayerIdentity$ ', () => {
      component.requestPlayerIdentity$(gamertag);

      expect(mockGravityService.getPlayerIdentity$).toHaveBeenCalledWith({ gamertag: gamertag });
    });
  });
});
