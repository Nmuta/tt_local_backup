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
import { createMockBlobStorageService } from '@services/blob-storage';
import { of } from 'rxjs';

import {
  PlayFabBuildsManagementComponent,
  PlayFabBuildsManagementServiceContract,
} from './playfab-builds-management.component';

describe('PlayFabBuildsManagementComponent', () => {
  let component: PlayFabBuildsManagementComponent;
  let fixture: ComponentFixture<PlayFabBuildsManagementComponent>;

  const mockService: PlayFabBuildsManagementServiceContract = {
    gameTitle: GameTitle.FH5,
    getPlayFabBuilds$: () => {
      return of(undefined);
    },
    getPlayFabBuildLocks$: () => {
      return of(undefined);
    },
    addPlayFabBuildLock$: () => {
      return of(undefined);
    },
    deletePlayFabBuildLock$: () => {
      return of(undefined);
    },
  };

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
      declarations: [PlayFabBuildsManagementComponent],
      providers: [createMockBlobStorageService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayFabBuildsManagementComponent);
    component = fixture.componentInstance;
    component.service = mockService;
    fixture.detectChanges();
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
          component.ngOnChanges({});

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual(
            'No service contract was provided for ListUsersInGroupComponent',
          );
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          component.ngOnChanges({});

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
