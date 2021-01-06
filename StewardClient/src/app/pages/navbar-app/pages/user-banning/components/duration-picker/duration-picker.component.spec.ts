import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { last } from 'lodash';

import { DurationPickerComponent } from './duration-picker.component';

describe('DurationPickerComponent', () => {
  let component: DurationPickerComponent;
  let fixture: ComponentFixture<DurationPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DurationPickerComponent],
      imports: [MatDatepickerModule, MatNativeDateModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Control Contract', () => {
    let onChangeFunction: (data: unknown) => unknown;
    let onTouchedFunction: () => unknown;

    beforeEach(() => {
      onChangeFunction = jasmine.createSpy('onChangeFunction');
      onChangeFunction = jasmine.createSpy('onTouchFunction');
      component.registerOnChange(onChangeFunction);
      component.registerOnTouched(onTouchedFunction);
    });

    it('should not call onChange when writeValue(data) called', () => {
      component.writeValue(last(component.options).duration);
      expect(onChangeFunction).toHaveBeenCalledTimes(0);
    });

    it('should call onChange(data) when changed internally', () => {
      component.formControl.setValue(last(component.options).duration);
      expect(onChangeFunction).toHaveBeenCalledTimes(1);
    });

    it('setDisabledState(true)', () => {
      component.setDisabledState(true);
      expect(component.formControl.disabled).toBeTruthy();
    });

    it('setDisabledState(false)', () => {
      component.setDisabledState(false);
      expect(component.formControl.disabled).toBeFalsy();
    });
  });
});
