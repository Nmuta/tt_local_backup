import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BanSummariesTableData, BulkBanReviewComponent } from './bulk-ban-review.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { ApolloService, createMockApolloService } from '@services/apollo';
import { BrowserModule } from '@angular/platform-browser';
import { fakeBigNumber, fakeXuid } from '@interceptors/fake-api/utility';
import { BulkBanReviewInput } from './components/bulk-ban-review-input.component';
import faker from '@faker-js/faker';
import { of } from 'rxjs';
import BigNumber from 'bignumber.js';
import { ActivatedRoute } from '@angular/router';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';

const activatedRouteMock = {
  pathFromRoot: [
    {
      snapshot: { url: [{ path: 'tools' }] },
    } as ActivatedRoute,
  ] as ActivatedRoute[],
};

describe('BulkBanReviewComponent', () => {
  let component: BulkBanReviewComponent;
  let fixture: ComponentFixture<BulkBanReviewComponent>;

  let mockWoodstockService: WoodstockService;
  let mockSunriseService: SunriseService;
  let mockApolloService: ApolloService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        MatPaginatorModule,
        BrowserModule,
        BrowserAnimationsModule,
      ],
      declarations: [BulkBanReviewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWoodstockService(),
        createMockSunriseService(),
        createMockApolloService(),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkBanReviewComponent);
    component = fixture.debugElement.componentInstance;
    component.banHistoryList = new MatTableDataSource<BanSummariesTableData>();

    mockWoodstockService = TestBed.inject(WoodstockService);
    mockSunriseService = TestBed.inject(SunriseService);
    mockApolloService = TestBed.inject(ApolloService);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: lookupXuids', () => {
    const xuids = [fakeXuid(), fakeXuid(), fakeXuid()];

    beforeEach(() => {
      component.totalEnvironmentsSearched = -1;
      component.banHistoryList.data = [];

      component.buildCsvDownloadData = jasmine.createSpy('buildCsvDownloadData');
      component.sortNonApprovedPlayers = jasmine.createSpy('sortNonApprovedPlayers');
      component.calculateStatistics = jasmine.createSpy('calculateStatistics');

      mockWoodstockService.getBanSummariesByXuids$ = jasmine
        .createSpy('mockSunriseService.getBanSummariesByXuids$')
        .and.returnValue(
          of(
            xuids.map(xuid => {
              return {
                xuid: xuid,
                gamertag: faker.random.word(),
                banCount: fakeBigNumber(),
                bannedAreas: [],
                lastBanDescription: undefined,
                userExists: true,
              };
            }),
          ),
        );

      mockSunriseService.getBanSummariesByXuids$ = jasmine
        .createSpy('mockSunriseService.getBanSummariesByXuids$')
        .and.returnValue(
          of(
            xuids.map(xuid => {
              return {
                xuid: xuid,
                gamertag: faker.random.word(),
                banCount: fakeBigNumber(),
                bannedAreas: [],
                lastBanDescription: undefined,
                userExists: true,
              };
            }),
          ),
        );

      mockApolloService.getBanSummariesByXuids$ = jasmine
        .createSpy('mockApolloService.getBanSummariesByXuids$')
        .and.returnValue(
          of(
            xuids.map(xuid => {
              return {
                xuid: xuid,
                gamertag: faker.random.word(),
                banCount: fakeBigNumber(),
                bannedAreas: [],
                lastBanDescription: undefined,
                userExists: true,
              };
            }),
          ),
        );
    });

    describe('If input is null', () => {
      it('should not do anything', () => {
        component.lookupXuids(null);

        expect(component.totalEnvironmentsSearched).toEqual(-1);
      });
    });

    describe('If input is valid', () => {
      const input = {
        woodstockEnvironments: ['Retail'],
        sunriseEnvironments: ['Retail'],
        apolloEnvironments: ['Retail'],
        xuids: xuids,
      } as BulkBanReviewInput;

      it('should set totalEnvironmentsSearched', () => {
        component.lookupXuids(input);

        expect(component.totalEnvironmentsSearched).toEqual(
          input.woodstockEnvironments.length +
            input.sunriseEnvironments.length +
            input.apolloEnvironments.length,
        );
      });

      it('should set banHistoryList.data', () => {
        component.lookupXuids(input);

        expect(component.banHistoryList?.data?.length).toEqual(xuids.length);
      });

      it('should call buildCsvDownloadData', () => {
        component.lookupXuids(input);

        expect(component.buildCsvDownloadData).toHaveBeenCalled();
      });

      it('should call sortNonApprovedPlayers', () => {
        component.lookupXuids(input);

        expect(component.sortNonApprovedPlayers).toHaveBeenCalled();
      });

      it('should call calculateStatistics', () => {
        component.lookupXuids(input);

        expect(component.calculateStatistics).toHaveBeenCalled();
      });
    });
  });

  describe('Method: calculateStatistics', () => {
    beforeEach(() => {
      component.banHistoryList.data = [
        {
          xuid: fakeXuid(),
          gamertag: faker.random.word(),
          summaries: [],
          approved: true,
          totalBans: fakeBigNumber(),
        } as BanSummariesTableData,
        {
          xuid: fakeXuid(),
          gamertag: faker.random.word(),
          summaries: [],
          approved: false,
          totalBans: fakeBigNumber(),
        } as BanSummariesTableData,
      ];
    });

    it('should correctly set playersInReview', () => {
      component.calculateStatistics();

      expect(component.playersInReview).toEqual(1);
    });
  });

  describe('Method: removePlayer', () => {
    const playerToRemove = {
      xuid: fakeXuid(),
      gamertag: faker.random.word(),
      summaries: [],
      approved: true,
      totalBans: fakeBigNumber(),
    } as BanSummariesTableData;

    beforeEach(() => {
      component.buildCsvDownloadData = jasmine.createSpy('buildCsvDownloadData');
      component.sortNonApprovedPlayers = jasmine.createSpy('sortNonApprovedPlayers');
      component.calculateStatistics = jasmine.createSpy('calculateStatistics');

      component.banHistoryList.data = [
        playerToRemove,
        {
          xuid: fakeXuid(),
          gamertag: faker.random.word(),
          summaries: [],
          approved: false,
          totalBans: fakeBigNumber(),
        } as BanSummariesTableData,
      ];

      component.removedPlayers = [];
    });

    it('should remove the player from the correct index', () => {
      component.removePlayer(0);

      expect(component.banHistoryList.data.length).toEqual(1);
      expect(component.banHistoryList.data[0].xuid).not.toEqual(playerToRemove.xuid);
    });

    it('should remove the player from the correct index', () => {
      component.removePlayer(0);

      expect(component.removedPlayers.length).toEqual(1);
      expect(component.removedPlayers[0].xuid).toEqual(playerToRemove.xuid);
    });

    it('should call buildCsvDownloadData', () => {
      component.removePlayer(0);

      expect(component.buildCsvDownloadData).toHaveBeenCalled();
    });

    it('should call calculateStatistics', () => {
      component.removePlayer(0);

      expect(component.calculateStatistics).toHaveBeenCalled();
    });
  });

  describe('Method: approvePlayer', () => {
    beforeEach(() => {
      const playerToApprove = {
        xuid: fakeXuid(),
        gamertag: faker.random.word(),
        summaries: [],
        approved: false,
        totalBans: fakeBigNumber(),
      } as BanSummariesTableData;

      component.buildCsvDownloadData = jasmine.createSpy('buildCsvDownloadData');
      component.sortNonApprovedPlayers = jasmine.createSpy('sortNonApprovedPlayers');
      component.calculateStatistics = jasmine.createSpy('calculateStatistics');

      component.banHistoryList.data = [playerToApprove];
    });

    it('should approved to true at the correct index', () => {
      expect(component.banHistoryList.data[0].approved).toBeFalsy();
      component.approvePlayer(0);

      expect(component.banHistoryList.data[0].approved).toBeTruthy();
    });

    it('should call buildCsvDownloadData', () => {
      component.approvePlayer(0);

      expect(component.buildCsvDownloadData).toHaveBeenCalled();
    });

    it('should call calculateStatistics', () => {
      component.approvePlayer(0);

      expect(component.calculateStatistics).toHaveBeenCalled();
    });

    it('should call sortNonApprovedPlayers', () => {
      component.approvePlayer(0);

      expect(component.sortNonApprovedPlayers).toHaveBeenCalled();
    });
  });

  describe('Method: sortNonApprovedPlayers', () => {
    const firstPositionPlayer = {
      xuid: new BigNumber(1),
      gamertag: faker.random.word(),
      summaries: [],
      approved: false,
      totalBans: new BigNumber(3),
    } as BanSummariesTableData;

    const secondPositionPlayer = {
      xuid: new BigNumber(2),
      gamertag: faker.random.word(),
      summaries: [],
      approved: false,
      totalBans: new BigNumber(1),
    } as BanSummariesTableData;

    const thirdPositionPlayer = {
      xuid: new BigNumber(3),
      gamertag: faker.random.word(),
      summaries: [],
      approved: true,
      totalBans: fakeBigNumber(),
    } as BanSummariesTableData;

    beforeEach(() => {
      // Mixup the order
      component.banHistoryList.data = [
        secondPositionPlayer,
        thirdPositionPlayer,
        firstPositionPlayer,
      ];
    });

    it('should sort the banHistoryList correctly', () => {
      component.sortNonApprovedPlayers();

      expect(component.banHistoryList.data?.length).toEqual(3);
      expect(component.banHistoryList.data[0].xuid).toEqual(firstPositionPlayer.xuid);
      expect(component.banHistoryList.data[1].xuid).toEqual(secondPositionPlayer.xuid);
      expect(component.banHistoryList.data[2].xuid).toEqual(thirdPositionPlayer.xuid);
    });
  });

  describe('Method: reset', () => {
    beforeEach(() => {
      // Mixup the order
      component.banHistoryList.data = [
        {
          xuid: fakeXuid(),
          gamertag: faker.random.word(),
          summaries: [],
          approved: false,
          totalBans: new BigNumber(3),
        } as BanSummariesTableData,
      ];
    });

    it('should clear banHistoryList.data', () => {
      component.reset();

      expect(component.banHistoryList.data?.length).toEqual(0);
    });
  });

  describe('Method: buildCsvDownloadData', () => {
    const approvedPlayer = {
      xuid: fakeXuid(),
      gamertag: faker.random.word(),
      summaries: [],
      approved: true,
      totalBans: new BigNumber(0),
    } as BanSummariesTableData;

    const nonApprovedPlayer = {
      xuid: fakeXuid(),
      gamertag: faker.random.word(),
      summaries: [],
      approved: false,
      totalBans: new BigNumber(1),
    } as BanSummariesTableData;

    const removedPlayer = {
      xuid: fakeXuid(),
      gamertag: faker.random.word(),
      summaries: [],
      approved: false,
      totalBans: fakeBigNumber(),
    } as BanSummariesTableData;

    beforeEach(() => {
      component.banHistoryList.data = [approvedPlayer, nonApprovedPlayer];
      component.removedPlayers = [removedPlayer];
    });

    it('should correctly build the currentUserListCsvData', () => {
      component.buildCsvDownloadData();

      expect(component.currentUserListCsvData.length).toEqual(3);
      expect(component.currentUserListCsvData[0]).toEqual(component.csvHeader);
      expect(component.currentUserListCsvData[1][0]).toEqual(approvedPlayer.xuid.toString());
      expect(component.currentUserListCsvData[2][0]).toEqual(nonApprovedPlayer.xuid.toString());
    });

    it('should correctly build the approvedUserListCsvData', () => {
      component.buildCsvDownloadData();

      expect(component.approvedUserListCsvData.length).toEqual(2);
      expect(component.approvedUserListCsvData[0]).toEqual(component.csvHeader);
      expect(component.approvedUserListCsvData[1][0]).toEqual(approvedPlayer.xuid.toString());
    });

    it('should correctly build the removedUserListCsvData', () => {
      component.buildCsvDownloadData();

      expect(component.removedUserListCsvData.length).toEqual(2);
      expect(component.removedUserListCsvData[0]).toEqual(component.csvHeader);
      expect(component.removedUserListCsvData[1][0]).toEqual(removedPlayer.xuid.toString());
    });
  });
});
