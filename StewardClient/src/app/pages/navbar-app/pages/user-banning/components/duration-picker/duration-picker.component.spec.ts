import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationPickerComponent } from './duration-picker.component';

describe('DurationPickerComponent', () => {
  let component: DurationPickerComponent;
  let fixture: ComponentFixture<DurationPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationPickerComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
