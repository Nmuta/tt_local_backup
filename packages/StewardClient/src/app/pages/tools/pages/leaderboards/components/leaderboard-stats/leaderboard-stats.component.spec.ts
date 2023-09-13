import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import faker from '@faker-js/faker';

import { LeaderboardStatsComponent, LeaderboardStatsContract } from './leaderboard-stats.component';
import { toDateTime } from '@helpers/luxon';
import { LeaderboardEnvironment, LeaderboardQuery, LeaderboardScore } from '@models/leaderboards';
import { NgxLineChartClickEvent } from '@models/ngx-charts';
import { QueryList, SimpleChanges } from '@angular/core';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'LeaderboardStatsComponent', () => {
  let component: LeaderboardStatsComponent;
  let fixture: ComponentFixture<LeaderboardStatsComponent>;

  const mockService: LeaderboardStatsContract = {
    talentUserGroupId: -1000000,
    getLeaderboardScores$: () => {
      return of([]);
    },

    getLeaderboardTalentIdentities$: () => {
      return of([]);
    },
  };

  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  const testLeaderboardScores: LeaderboardScore[] = [
    {
      position: fakeBigNumber(),
      xuid: fakeBigNumber(),
      id: faker.datatype.uuid(),
      submissionTimeUtc: toDateTime(faker.date.past()),
      score: fakeBigNumber(),
      carClass: faker.random.word(),
      carPerformanceIndex: fakeBigNumber(),
      car: faker.random.word(),
      carDriveType: faker.random.word(),
      track: faker.random.word(),
      isClean: faker.datatype.boolean(),
      stabilityManagement: faker.datatype.boolean(),
      antiLockBrakingSystem: faker.datatype.boolean(),
      tractionControlSystem: faker.datatype.boolean(),
      automaticTransmission: faker.datatype.boolean(),
      deviceType: faker.random.word(),
    },
    {
      position: fakeBigNumber(),
      xuid: fakeBigNumber(),
      id: faker.datatype.uuid(),
      submissionTimeUtc: toDateTime(faker.date.past()),
      score: fakeBigNumber(),
      carClass: faker.random.word(),
      carPerformanceIndex: fakeBigNumber(),
      car: faker.random.word(),
      carDriveType: faker.random.word(),
      track: faker.random.word(),
      isClean: faker.datatype.boolean(),
      stabilityManagement: faker.datatype.boolean(),
      antiLockBrakingSystem: faker.datatype.boolean(),
      tractionControlSystem: faker.datatype.boolean(),
      automaticTransmission: faker.datatype.boolean(),
      deviceType: faker.random.word(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([]),
          FormsModule,
          ReactiveFormsModule,
          MatAutocompleteModule,
          MatSelectModule,
          MatFormFieldModule,
          MatInputModule,
        ],
        declarations: [LeaderboardStatsComponent, HumanizePipe],
        providers: [{ provide: UntypedFormBuilder, useValue: formBuilder }],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(LeaderboardStatsComponent);
    component = fixture.componentInstance;
    component.service = mockService;
    component.childMenuTriggers = new QueryList<MatMenuTrigger>();
    component.scores = testLeaderboardScores;

    component.selectedScore.emit = jasmine.createSpy('selectedScore.emit');
    mockService.getLeaderboardScores$ = jasmine
      .createSpy('getLeaderboardScores$')
      .and.returnValue(of(testLeaderboardScores));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    describe('When there are query changes', () => {
      const query: LeaderboardQuery = {
        scoreboardTypeId: fakeBigNumber(),
        scoreTypeId: fakeBigNumber(),
        gameScoreboardId: fakeBigNumber(),
        trackId: fakeBigNumber(),
        deviceTypes: '',
        leaderboardEnvironment: LeaderboardEnvironment.Dev,
      };

      const changesWithQuery: SimpleChanges = {
        leaderboard: {
          previousValue: null,
          currentValue: {
            metadata: null,
            query: query,
          },
          firstChange: false,
          isFirstChange: () => {
            return false;
          },
        },
      };

      beforeEach(() => {
        component.leaderboard = {
          metadata: null,
          query: query,
        };
      });

      it('should request getLeaderboardScores$', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component.ngOnChanges(<any>changesWithQuery);

        expect(mockService.getLeaderboardScores$).toHaveBeenCalled();
      });
    });

    describe('When there are not query changes', () => {
      const changesWithoutQuery: SimpleChanges = {
        notQuery: {
          previousValue: null,
          currentValue: null,
          firstChange: false,
          isFirstChange: () => {
            return false;
          },
        },
      };

      it('should not request getLeaderboardScores$', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component.ngOnChanges(<any>changesWithoutQuery);

        expect(mockService.getLeaderboardScores$).not.toHaveBeenCalled();
      });
    });
  });

  describe('Method: onGraphClick', () => {
    describe('When click event relates to a valid score', () => {
      it('should emit selectedScore', () => {
        const validScoreEvent: NgxLineChartClickEvent = {
          name: component.scores[0].position.toString(),
          series: faker.random.word(),
          value: faker.datatype.number(),
        };
        component.onGraphClick(validScoreEvent);

        expect(component.selectedScore.emit).toHaveBeenCalled();
      });
    });

    describe('When click event does not relates to a valid score', () => {
      it('should not emit selectedScore', () => {
        const invalidScoreEvent: NgxLineChartClickEvent = {
          name: 'invalid-score',
          series: faker.random.word(),
          value: faker.datatype.number(),
        };
        component.onGraphClick(invalidScoreEvent);

        expect(component.selectedScore.emit).not.toHaveBeenCalled();
      });
    });
  });
});
