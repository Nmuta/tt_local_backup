import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
import { SimpleChanges } from '@angular/core';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('LeaderboardStatsComponent', () => {
  let component: LeaderboardStatsComponent;
  let fixture: ComponentFixture<LeaderboardStatsComponent>;

  const mockService: LeaderboardStatsContract = {
    getLeaderboardScores$: () => {
      return of([]);
    },
  };

  const formBuilder: FormBuilder = new FormBuilder();

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
    await TestBed.configureTestingModule({
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
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardStatsComponent);
    component = fixture.componentInstance;
    component.service = mockService;
    component.scores = testLeaderboardScores;

    component.selectedScore.emit = jasmine.createSpy('selectedScore.emit');
    mockService.getLeaderboardScores$ = jasmine
      .createSpy('getLeaderboardScores$')
      .and.returnValue(of(testLeaderboardScores));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          fixture.detectChanges();

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual('No service is defined for leaderboard stats.');
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          fixture.detectChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
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
        component.ngOnChanges(changesWithQuery);

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
        component.ngOnChanges(changesWithoutQuery);

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
