import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Leaderboard } from '@models/leaderboards';
import { NgxsModule } from '@ngxs/store';
import { createMockBlobStorageService, BlobStorageService } from '@services/blob-storage';
import { of } from 'rxjs';
import {
  SearchLeaderboardsComponent,
  SearchLeaderboardsContract,
} from './search-leaderboards.component';
import faker from '@faker-js/faker';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';

describe('SearchLeaderboardsComponent', () => {
  let component: SearchLeaderboardsComponent;
  let fixture: ComponentFixture<SearchLeaderboardsComponent>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockBlobStorageService: BlobStorageService;
  const mockService: SearchLeaderboardsContract = {
    getLeaderboards$: () => {
      return of([]);
    },
  };

  const testLeaderboardFilters = [
    {
      type: 'ScoreType',
      id: fakeBigNumber(),
      name: faker.random.word(),
    },
    {
      type: 'CarClass',
      id: fakeBigNumber(),
      name: faker.random.word(),
    },
  ];

  const testLeaderboard: Leaderboard = {
    name: faker.random.words(3),
    gameScoreboardId: fakeBigNumber(),
    trackId: fakeBigNumber(),
    scoreboardTypeId: fakeBigNumber(),
    scoreboardType: faker.random.word(),
    scoreTypeId: fakeBigNumber(),
    scoreType: faker.random.word(),
    carClassId: fakeBigNumber(),
    carClass: faker.random.word(),
    validationData: [],
  };

  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

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
        PipesModule,
      ],
      declarations: [SearchLeaderboardsComponent, HumanizePipe],
      providers: [
        createMockBlobStorageService(),
        { provide: UntypedFormBuilder, useValue: formBuilder },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLeaderboardsComponent);
    component = fixture.componentInstance;

    component.service = mockService;

    mockBlobStorageService = TestBed.inject(BlobStorageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      mockService.getLeaderboards$ = jasmine.createSpy('getLeaderboards$').and.returnValue(of([]));
    });

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
          expect(e.message).toEqual('No service is defined for search leaderboard.');
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should request leaderboard information', () => {
        fixture.detectChanges();

        expect(mockService.getLeaderboards$).toHaveBeenCalled();
      });
    });
  });

  describe('Method: displayLeaderboards', () => {
    describe('When provided leaderboard is null', () => {
      it('should return empty string', () => {
        const result = component.displayLeaderboards(null);

        expect(result).toEqual('');
      });
    });

    describe('When provided leaderboard is valid', () => {
      it('should return empty string', () => {
        const result = component.displayLeaderboards(testLeaderboard);

        expect(result).toEqual(`${testLeaderboard.name} ${testLeaderboard.scoreType}`);
      });
    });
  });

  describe('Method: removeFilter', () => {
    beforeEach(() => {
      component.selectedFiltersChange = jasmine
        .createSpy('selectedFiltersChange')
        .and.callThrough();

      component.formControls.filters.setValue(testLeaderboardFilters);
    });

    it('should remove the provided filter from form controls list', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.removeFilter(testLeaderboardFilters[1] as any);

      const updatedFilters = component.formControls.filters.value;
      expect(updatedFilters.length).toEqual(1);
      expect(updatedFilters[0].id).toEqual(testLeaderboardFilters[0].id);
      expect(component.selectedFiltersChange).toHaveBeenCalled();
    });
  });

  describe('Method: removeAllFilters', () => {
    beforeEach(() => {
      component.selectedFiltersChange = jasmine
        .createSpy('selectedFiltersChange')
        .and.callThrough();

      component.formControls.filters.setValue(testLeaderboardFilters);
    });

    it('should remove all filters from form controls list', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.removeAllFilters();

      const updatedFilters = component.formControls.filters.value;
      expect(updatedFilters.length).toEqual(0);
      expect(component.selectedFiltersChange).toHaveBeenCalled();
    });
  });
});
