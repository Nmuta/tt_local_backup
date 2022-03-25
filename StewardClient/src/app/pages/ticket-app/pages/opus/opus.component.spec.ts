import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockTicketService } from '@services/zendesk';
import { of } from 'rxjs';
import faker from '@faker-js/faker';

import { OpusComponent } from './opus.component';
import { createMockOpusService, OpusService } from '@services/opus';

describe('OpusComponent - Ticket App', () => {
  let component: OpusComponent;
  let fixture: ComponentFixture<OpusComponent>;

  let mockStore: Store;
  let mockOpusService: OpusService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockOpusService(), createMockTicketService()],
    }).compileComponents();

    fixture = TestBed.createComponent(OpusComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of());

    mockOpusService = TestBed.inject(OpusService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: isInCorrectTitleRoute', () => {
    describe('When gameTitle matches Opus', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FH3);

        expect(result).toBeTruthy();
      });
    });
    describe('When gameTitle does not match Opus', () => {
      it('should return true', () => {
        const result = component.isInCorrectTitleRoute(GameTitleCodeName.FH4);

        expect(result).toBeFalsy();
      });
    });
  });

  describe('Method: requestPlayerIdentity$', () => {
    const gamertag = faker.name.firstName();

    it('should send request to mockOpusService.getPlayerIdentity$ ', () => {
      component.requestPlayerIdentity$(gamertag);

      expect(mockOpusService.getPlayerIdentity$).toHaveBeenCalledWith({ gamertag: gamertag });
    });
  });
});
