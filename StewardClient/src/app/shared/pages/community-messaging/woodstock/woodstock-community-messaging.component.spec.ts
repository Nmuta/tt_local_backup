import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { CommunityMessage, CommunityMessageResult } from '@models/community-message';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { of, throwError } from 'rxjs';

import { WoodstockCommunityMessagingComponent } from './woodstock-community-messaging.component';

describe('WoodstockCommunityMessagingComponent', () => {
  let component: WoodstockCommunityMessagingComponent;
  let fixture: ComponentFixture<WoodstockCommunityMessagingComponent>;
  let mockWoodstockService: WoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockCommunityMessagingComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockCommunityMessagingComponent);
    component = fixture.componentInstance;
    mockWoodstockService = TestBed.inject(WoodstockService);

    mockWoodstockService.postSendCommunityMessageToXuids$ = jasmine
      .createSpy('postSendCommunityMessageToXuids$')
      .and.returnValue(of([]));
    mockWoodstockService.postSendCommunityMessageToLspGroup$ = jasmine
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

      it('should call mockWoodstockService.postSendCommunityMessageToXuids$', () => {
        component.submitCommunityMessage();

        expect(mockWoodstockService.postSendCommunityMessageToXuids$).toHaveBeenCalled();
      });
    });

    describe('When isUsingPlayerIdentities is false', () => {
      beforeEach(() => {
        component.isUsingPlayerIdentities = false;
      });

      it('should call mockWoodstockService.postSendCommunityMessageToLspGroup$', () => {
        component.submitCommunityMessage();

        expect(mockWoodstockService.postSendCommunityMessageToLspGroup$).toHaveBeenCalled();
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
