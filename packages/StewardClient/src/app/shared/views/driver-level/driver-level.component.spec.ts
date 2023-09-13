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
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { DriverLevelComponent, DriverLevelServiceContract } from './driver-level.component';
import { of } from 'rxjs';
import BigNumber from 'bignumber.js';
import faker from '@faker-js/faker';
import { PlayerDriverLevel } from '@models/player-driver-level.model';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('DriverLevelComponent', () => {
  let component: DriverLevelComponent;
  let fixture: ComponentFixture<DriverLevelComponent>;

  const mockDriverLevel = {
    driverLevel: new BigNumber(faker.datatype.number()),
    prestigeRank: new BigNumber(faker.datatype.number()),
    experiencePoints: new BigNumber(faker.datatype.number()),
  } as PlayerDriverLevel;

  const mockService: DriverLevelServiceContract = {
    gameTitle: GameTitle.FM8,
    getDriverLevel$: () => {
      return of(mockDriverLevel);
    },
    setDriverLevel$: () => {
      return of(mockDriverLevel);
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
        declarations: [DriverLevelComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DriverLevelComponent);
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
          expect(e.message).toEqual('No service is defined for driver level component.');
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
