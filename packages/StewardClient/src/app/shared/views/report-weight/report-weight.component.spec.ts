import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { GameTitle, UserRole } from '@models/enums';
import { ReportWeightType, UserReportWeight } from '@models/report-weight';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserState } from '@shared/state/user/user.state';
import { of } from 'rxjs';
import { ReportWeightComponent, ReportWeightServiceContract } from './report-weight.component';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ReportWeightComponent', () => {
  let component: ReportWeightComponent;
  let fixture: ComponentFixture<ReportWeightComponent>;
  let mockStore: Store;
  const mockUserReportWeight = {
    weight: fakeBigNumber(),
    type: ReportWeightType.Default,
  } as UserReportWeight;

  const mockService: ReportWeightServiceContract = {
    gameTitle: GameTitle.FH5,
    getUserReportWeight$: () => {
      return of(mockUserReportWeight);
    },
    setUserReportWeight$: () => {
      return of(mockUserReportWeight);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
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
        declarations: [ReportWeightComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ReportWeightComponent);
    component = fixture.componentInstance;
    component.service = mockService;
    mockStore = TestBed.inject(Store);
    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
      emailAddress: faker.datatype.string(),
      role: UserRole.LiveOpsAdmin,
      name: faker.name.firstName(),
      objectId: faker.datatype.uuid(),
    } as UserModel);
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
          expect(e.message).toEqual('No service is defined for report weight component.');
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
});
