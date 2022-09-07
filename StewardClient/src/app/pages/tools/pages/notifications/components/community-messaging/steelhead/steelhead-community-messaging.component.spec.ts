import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { CommunityMessage, CommunityMessageResult } from '@models/community-message';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { of, throwError } from 'rxjs';

import { SteelheadCommunityMessagingComponent } from './steelhead-community-messaging.component';
import { SteelheadGroupMessagesService } from '@services/api-v2/steelhead/group/messages/steelhead-group-messages.service';
import { SteelheadPlayersMessagesService } from '@services/api-v2/steelhead/players/messages/steelhead-players-messages.service';
import { createMockSteelheadGroupMessagesService } from '@services/api-v2/steelhead/group/messages/steelhead-group-messages.service.mock';
import { createMockSteelheadPlayersMessagesService } from '@services/api-v2/steelhead/players/messages/steelhead-players-messages.service.mock';
import { PipesModule } from '@shared/pipes/pipes.module';

describe('SteelheadCommunityMessagingComponent', () => {
  let component: SteelheadCommunityMessagingComponent;
  let fixture: ComponentFixture<SteelheadCommunityMessagingComponent>;
  let mockSteelheadPlayersMessagesSerivce: SteelheadPlayersMessagesService;
  let mockSteelheadGroupMessagesService: SteelheadGroupMessagesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadCommunityMessagingComponent],
      imports: [PipesModule],
      providers: [
        createMockSteelheadPlayersMessagesService(),
        createMockSteelheadGroupMessagesService(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadCommunityMessagingComponent);
    component = fixture.componentInstance;
    mockSteelheadPlayersMessagesSerivce = TestBed.inject(SteelheadPlayersMessagesService);
    mockSteelheadGroupMessagesService = TestBed.inject(SteelheadGroupMessagesService);

    mockSteelheadPlayersMessagesSerivce.postSendCommunityMessageToXuids$ = jasmine
      .createSpy('postSendCommunityMessageToXuids$')
      .and.returnValue(of([]));
    mockSteelheadGroupMessagesService.postSendCommunityMessageToLspGroup$ = jasmine
      .createSpy('postSendCommunityMessageToLspGroup$')
      .and.returnValue(of({}));
    component.selectedLspGroup = { id: fakeBigNumber(), name: faker.random.words(3) };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: submitCommunityMessage', () => {
    describe('When isUsingPlayerIdentities is true', () => {
      beforeEach(() => {
        component.isUsingPlayerIdentities = true;
      });

      it('should call steelheadService.postSendCommunityMessageToXuids$', () => {
        component.submitCommunityMessage();

        expect(
          mockSteelheadPlayersMessagesSerivce.postSendCommunityMessageToXuids$,
        ).toHaveBeenCalled();
      });
    });

    describe('When isUsingPlayerIdentities is false', () => {
      beforeEach(() => {
        component.isUsingPlayerIdentities = false;
      });

      it('should call steelheadService.postSendCommunityMessageToLspGroup$', () => {
        component.submitCommunityMessage();

        expect(
          mockSteelheadGroupMessagesService.postSendCommunityMessageToLspGroup$,
        ).toHaveBeenCalled();
      });
    });
  });

  describe('Method: setNewCommunityMessage', () => {
    const message: CommunityMessage = {
      message: faker.random.words(10),
      expireTimeUtc: null,
      startTimeUtc: null,
    };

    it('should set appropriate component variables', () => {
      component.setNewCommunityMessage(message);

      expect(component.newCommunityMessage).toEqual(message);
      expect(component.waitingForVerification).toBeTruthy();
    });
  });

  describe('Method: submitCommunityMessage', () => {
    describe('When submitCommunityMessage$ returns valid data', () => {
      const ressult: CommunityMessageResult<BigNumber> = {
        playerOrLspGroup: fakeBigNumber(),
        identityAntecedent: GiftIdentityAntecedent.Xuid,
        error: null,
      };

      beforeEach(() => {
        component.submitCommunityMessage$ = jasmine
          .createSpy('submitCommunityMessage$')
          .and.returnValue(of([ressult]));
      });

      it('should set sentCommunityMessageResults', () => {
        component.submitCommunityMessage();

        expect(component.sentCommunityMessageResults?.length).toEqual(1);
      });
    });

    describe('When submitCommunityMessage$ throws error', () => {
      const error = { message: faker.random.words(10) };
      beforeEach(() => {
        component.submitCommunityMessage$ = jasmine
          .createSpy('submitCommunityMessage$')
          .and.returnValue(throwError(error));
      });

      it('should set error', () => {
        component.submitCommunityMessage();

        expect(component.loadError).toEqual(error);
      });
    });
  });

  describe('Method: clearMessageUI', () => {
    beforeEach(() => {
      component.sentCommunityMessageResults = [null, null];
      component.waitingForVerification = true;
      component.loadError = {};
      component.newCommunityMessage = {
        message: faker.random.words(10),
        expireTimeUtc: null,
        startTimeUtc: null,
      };
    });

    it('should clear UI', () => {
      component.clearMessageUI();

      expect(component.sentCommunityMessageResults?.length).toEqual(0);
      expect(component.waitingForVerification).toBeFalsy();
      expect(component.loadError).toBeUndefined();
      expect(component.newCommunityMessage).toBeUndefined();
    });
  });
});
