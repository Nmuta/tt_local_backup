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
import { createMockKustoService, KustoService } from '@services/kusto';

import { ReportedScoresComponent } from './reported-scores.component';

describe('ReportedScoresComponent', () => {
  let component: ReportedScoresComponent;
  let fixture: ComponentFixture<ReportedScoresComponent>;

  let mockKustoService: KustoService;

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
      declarations: [ReportedScoresComponent],
      providers: [createMockKustoService(), { provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportedScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockKustoService = TestBed.inject(KustoService);

    mockKustoService.getKustoQueries$ = jasmine.createSpy('getKustoQueries$');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});