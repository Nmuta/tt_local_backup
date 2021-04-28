import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';

import { ObligationDataActivitiesComponent } from './obligation-data-activities.component';

describe('ObligationDataActivitiesComponent', () => {
  let component: ObligationDataActivitiesComponent;
  let fixture: ComponentFixture<ObligationDataActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObligationDataActivitiesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [PipesModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligationDataActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
