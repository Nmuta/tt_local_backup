import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockBlobStorageService, BlobStorageService } from '@services/blob-storage';

import { SearchLeaderboardsComponent } from './search-leaderboards.component';

describe('SearchLeaderboardsComponent', () => {
  let component: SearchLeaderboardsComponent;
  let fixture: ComponentFixture<SearchLeaderboardsComponent>;

  let mockBlobStorageService: BlobStorageService;

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
      ],
      declarations: [SearchLeaderboardsComponent],
      providers: [createMockBlobStorageService(), { provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLeaderboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockBlobStorageService = TestBed.inject(BlobStorageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
