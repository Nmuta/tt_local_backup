import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GameTitle } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserState } from '@shared/state/user/user.state';
import { of } from 'rxjs';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { PlayerCmsOverride } from '@models/player-cms-override.model';
import { CmsOverrideComponent, CmsOverrideServiceContract } from './cms-override.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'CmsOverrideComponent', () => {
  let component: CmsOverrideComponent;
  let fixture: ComponentFixture<CmsOverrideComponent>;

  const mockCmsOverride = {
    environment: faker.random.word(),
    slot: faker.random.word(),
    snapshot: faker.random.word(),
  } as PlayerCmsOverride;

  const mockService: CmsOverrideServiceContract = {
    gameTitle: GameTitle.FH5,
    getUserCmsOverride$: () => {
      return of(mockCmsOverride);
    },
    setUserCmsOverride$: () => {
      return of();
    },
    deleteUserCmsOverride$: () => {
      return of();
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
        declarations: [CmsOverrideComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(CmsOverrideComponent);
    component = fixture.componentInstance;
    component.service = mockService;
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
          expect(e.message).toEqual('No service is defined for cms override component.');
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
