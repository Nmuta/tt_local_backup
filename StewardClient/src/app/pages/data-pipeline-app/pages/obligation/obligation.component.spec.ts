import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DependencyListComponent } from './components/dependency-list/dependency-list.component';
import { FullObligationInputComponent } from './components/full-obligation-input/full-obligation-input.component';
import { KustoFunctionComponent } from './components/kusto-function/kusto-function.component';
import { ObligationDataActivitiesComponent } from './components/obligation-data-activities/obligation-data-activities.component';
import { ObligationDataActivityComponent } from './components/obligation-data-activity/obligation-data-activity.component';

import { DataPipelineObligationComponent } from './obligation.component';

describe('DataPipelineObligationComponent', () => {
  let component: DataPipelineObligationComponent;
  let fixture: ComponentFixture<DataPipelineObligationComponent>;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
        PipesModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        DataPipelineObligationComponent,
        FullObligationInputComponent,
        ObligationDataActivityComponent,
        ObligationDataActivitiesComponent,
        KustoFunctionComponent,
        DependencyListComponent,
      ],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();

    fixture = TestBed.createComponent(DataPipelineObligationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
