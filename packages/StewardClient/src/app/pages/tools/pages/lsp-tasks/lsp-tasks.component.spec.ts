import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { LspTasksComponent } from './lsp-tasks.component';

describe('TaskComponent', () => {
  let component: LspTasksComponent;
  let fixture: ComponentFixture<LspTasksComponent>;

  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [LspTasksComponent],
      providers: [{ provide: UntypedFormBuilder, useValue: formBuilder }],
    }).compileComponents();

    fixture = TestBed.createComponent(LspTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
