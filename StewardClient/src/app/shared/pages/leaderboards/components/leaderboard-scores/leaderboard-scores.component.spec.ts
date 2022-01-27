import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LeaderboardScore } from '@models/leaderboards';
import { NgxsModule } from '@ngxs/store';
import { createMockKustoService, KustoService } from '@services/kusto';
import { of } from 'rxjs';
import {
  LeaderboardScoresComponent,
  LeaderboardScoresContract,
} from './leaderboard-scores.component';
import faker from 'faker';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { toDateTime } from '@helpers/luxon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LeaderboardScoresComponent', () => {
  let component: LeaderboardScoresComponent;
  let fixture: ComponentFixture<LeaderboardScoresComponent>;

  let mockKustoService: KustoService;
  const mockService: LeaderboardScoresContract = {
    getLeaderboardScores$: () => {
      return of([]);
    },
    getLeaderboardMetadata$: () => {
      return of();
    },
    getLeaderboardScoresNearPlayer$: () => {
      return of([]);
    },
    deleteLeaderboardScores$: () => {
      return of();
    },
  };

  const testLeaderboardScores: LeaderboardScore[] = [
    {
      position: fakeBigNumber(),
      xuid: fakeBigNumber(),
      id: faker.datatype.uuid(),
      submissionTime: toDateTime(faker.date.past()),
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
    },
    {
      position: fakeBigNumber(),
      xuid: fakeBigNumber(),
      id: faker.datatype.uuid(),
      submissionTime: toDateTime(faker.date.past()),
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
    },
  ];

  const formBuilder: FormBuilder = new FormBuilder();

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
        MatPaginatorModule,
      ],
      declarations: [LeaderboardScoresComponent],
      providers: [createMockKustoService(), { provide: FormBuilder, useValue: formBuilder }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardScoresComponent);
    component = fixture.componentInstance;
    component.service = mockService;
    component.leaderboardScores.data = testLeaderboardScores;

    mockKustoService = TestBed.inject(KustoService);
    mockKustoService.getKustoQueries$ = jasmine.createSpy('getKustoQueries$');
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
          expect(e.message).toEqual('No service is defined for leaderboard scores.');
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

  describe('Method: ngAfterViewInit', () => {
    it('should set component paginator', () => {
      component.ngAfterViewInit();

      expect(component.leaderboardScores.paginator).toEqual(component.paginator);
    });
  });

  describe('Method: onRowClicked', () => {
    describe('When row clicked is in selectedScores list', () => {
      beforeEach(() => {
        component.selectedScores = testLeaderboardScores.map(s => {
          s.selected = true;
          return s;
        });
      });

      it('should remove the provided score from selected scores', () => {
        const scoreClicked = component.selectedScores[0];
        const expectedScore = component.selectedScores[1];
        component.onRowClicked(scoreClicked);

        expect(component.selectedScores.length).toEqual(1);
        expect(component.selectedScores[0].id).toEqual(expectedScore.id);
      });
    });

    describe('When row clicked is not in selectedScores list', () => {
      const scoreClicked = testLeaderboardScores[0];
      const selectedScore = testLeaderboardScores[1];
      selectedScore.selected = true;

      beforeEach(() => {
        component.selectedScores = [selectedScore];
      });

      it('should remove the provided score from selected scores', () => {
        component.onRowClicked(scoreClicked);

        expect(component.selectedScores.length).toEqual(2);
        expect(component.selectedScores[0].id).toEqual(selectedScore.id);
        expect(component.selectedScores[1].id).toEqual(scoreClicked.id);
      });
    });
  });

  describe('Method: unselectAllScores', () => {
    beforeEach(() => {
      component.selectedScores = testLeaderboardScores.map(s => {
        s.selected = true;
        return s;
      });
    });

    it('should unselect all scores', () => {
      component.unselectAllScores();

      expect(component.selectedScores.length).toEqual(0);
    });
  });

  describe('Method: deleteScores', () => {
    const scoreToDelete = testLeaderboardScores[0];

    beforeEach(() => {
      component.activeLeaderboardQuery = {
        scoreboardTypeId: fakeBigNumber(),
        scoreTypeId: fakeBigNumber(),
        gameScoreboardId: fakeBigNumber(),
        trackId: fakeBigNumber(),
      };
      mockService.deleteLeaderboardScores$ = jasmine
        .createSpy('deleteLeaderboardScores$')
        .and.returnValue(of());
    });

    it('should send delete request with correct params', () => {
      component.deleteScores([scoreToDelete]);

      expect(mockService.deleteLeaderboardScores$).toHaveBeenCalledWith([scoreToDelete.id]);
    });
  });
});
