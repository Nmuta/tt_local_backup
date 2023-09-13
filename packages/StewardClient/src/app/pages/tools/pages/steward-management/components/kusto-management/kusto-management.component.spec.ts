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
import { createMockKustoService, KustoService } from '@services/kusto';

import { KustoManagementComponent } from './kusto-management.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'KustoManagementComponent', () => {
  let component: KustoManagementComponent;
  let fixture: ComponentFixture<KustoManagementComponent>;

  let mockKustoService: KustoService;

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
        declarations: [KustoManagementComponent],
        providers: [
          createMockKustoService(),
          { provide: UntypedFormBuilder, useValue: formBuilder },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(KustoManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockKustoService = TestBed.inject(KustoService);

    mockKustoService.getKustoQueries$ = jasmine.createSpy('getKustoQueries$');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
