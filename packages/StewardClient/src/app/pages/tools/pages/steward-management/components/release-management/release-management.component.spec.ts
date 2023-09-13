import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { createMockBlobStorageService, BlobStorageService } from '@services/blob-storage';

import { ReleaseManagementComponent } from './release-management.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ReleaseManagementComponent', () => {
  let component: ReleaseManagementComponent;
  let fixture: ComponentFixture<ReleaseManagementComponent>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockBlobStorageService: BlobStorageService;

  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

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
        declarations: [ReleaseManagementComponent],
        providers: [
          createMockBlobStorageService(),
          createMockBackgroundJobService(),
          { provide: UntypedFormBuilder, useValue: formBuilder },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ReleaseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockBlobStorageService = TestBed.inject(BlobStorageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
