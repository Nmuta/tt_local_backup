import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { CommunityMessage, CommunityMessageResult } from '@models/community-message';
import { createMockSteelheadService, SteelheadService } from '@services/steelhead';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { of, throwError } from 'rxjs';

import { SteelheadCommunityMessagingComponent } from './steelhead-community-messaging.component';

describe('SteelheadCommunityMessagingComponent', () => {
  let component: SteelheadCommunityMessagingComponent;
  let fixture: ComponentFixture<SteelheadCommunityMessagingComponent>;
  let mockSteelheadSerivce: SteelheadService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadCommunityMessagingComponent],
      providers: [createMockSteelheadService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadCommunityMessagingComponent);
    component = fixture.componentInstance;
    mockSteelheadSerivce = TestBed.inject(SteelheadService);

    mockSteelheadSerivce.postSendCommunityMessageToXuids$ = jasmine
      .createSpy('postSendCommunityMessageToXuids$')
      .and.returnValue(of([]));
    mockSteelheadSerivce.postSendCommunityMessageToLspGroup$ = jasmine
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

        expect(mockSteelheadSerivce.postSendCommunityMessageToXuids$).toHaveBeenCalled();
      });
    });

    describe('When isUsingPlayerIdentities is false', () => {
      beforeEach(() => {
        component.isUsingPlayerIdentities = false;
      });

      it('should call steelheadService.postSendCommunityMessageToLspGroup$', () => {
        component.submitCommunityMessage();

        expect(mockSteelheadSerivce.postSendCommunityMessageToLspGroup$).toHaveBeenCalled();
      });
    });
  });

  describe('Method: setNewCommunityMessage', () => {
    const message: CommunityMessage = {
      message: faker.random.words(10),
      expiryDate: null,
      duration: null,
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
        expiryDate: null,
        duration: null,
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
