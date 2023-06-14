import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GameTitle } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserState } from '@shared/state/user/user.state';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { of } from 'rxjs';
import BigNumber from 'bignumber.js';
import faker from '@faker-js/faker';
import { SkillRatingComponent, SkillRatingServiceContract } from './skill-rating.component';
import { SkillRatingSummary } from '@services/api-v2/steelhead/player/skill-rating/steelhead-player-skill-rating.service';

describe('SkillRatingComponent', () => {
  let component: SkillRatingComponent;
  let fixture: ComponentFixture<SkillRatingComponent>;

  const mockSkillRatingSummary = {
    rawMean: new BigNumber(faker.datatype.number()),
    normalizedMean: new BigNumber(faker.datatype.number()),
    overriddenScore: new BigNumber(faker.datatype.number()),
    isScoreOverridden: faker.datatype.boolean(),
    normalizationMin: new BigNumber(faker.datatype.number()),
    normalizationMax: new BigNumber(faker.datatype.number()),
  } as SkillRatingSummary;

  const mockService: SkillRatingServiceContract = {
    gameTitle: GameTitle.FM8,
    getSkillRating$: () => {
      return of(mockSkillRatingSummary);
    },
    overrideSkillRating$: () => {
      return of(mockSkillRatingSummary);
    },
    clearSkillRatingOverride$: () => {
      return of(mockSkillRatingSummary);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        PipesModule,
      ],
      providers: [createMockMsalServices(), createMockLoggerService()],
      declarations: [SkillRatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillRatingComponent);
    component = fixture.componentInstance;
    component.service = mockService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{});

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual('No service is defined for skill rating component.');
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{});

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
