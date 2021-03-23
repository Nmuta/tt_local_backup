import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPipelineHomeComponent } from './home.component';

describe('DataPipelineHomeComponent', () => {
  let component: DataPipelineHomeComponent;
  let fixture: ComponentFixture<DataPipelineHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataPipelineHomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPipelineHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
