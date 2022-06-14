import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { fakeBigNumber, fakeXuid } from '@interceptors/fake-api/utility';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';
import { ApolloGiftingService } from './apollo-gifting.service';
import faker from '@faker-js/faker';
import { GroupGift, Gift } from '@models/gift';
import { LspGroup } from '@models/lsp-group';

describe('ApolloGiftingService', () => {
  let injector: TestBed;
  let service: ApolloGiftingService;
  let apiServiceMock: ApiService;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(ApolloGiftingService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: postGiftLiveryToPlayersUsingBackgroundJob', () => {
    const fakeLiveryId = faker.datatype.uuid();
    const fakeGroupGift = {
      xuids: [fakeXuid()],
      giftReason: faker.random.words(3),
    } as GroupGift;

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of({}));
    });

    it('should call service.postRequest$ with correct params', done => {
      service
        .postGiftLiveryToPlayersUsingBackgroundJob$(fakeLiveryId, fakeGroupGift)
        .subscribe(() => {
          expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
            `${service.basePath}/livery/${fakeLiveryId}/players/useBackgroundProcessing`,
            fakeGroupGift,
          );
          done();
        });
    });
  });

  describe('Method: postGiftLiveryToLspGroup', () => {
    const fakeLiveryId = faker.datatype.uuid();
    const fakeLspGroup = {
      id: fakeBigNumber(),
      name: faker.random.words(3),
    } as LspGroup;
    const fakeGift = {
      giftReason: faker.random.words(3),
    } as Gift;

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of({}));
    });

    it('should call service.postRequest$ with correct params', done => {
      service.postGiftLiveryToLspGroup$(fakeLiveryId, fakeLspGroup, fakeGift).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/livery/${fakeLiveryId}/groupId/${fakeLspGroup.id}`,
          fakeGift,
        );
        done();
      });
    });
  });
});
