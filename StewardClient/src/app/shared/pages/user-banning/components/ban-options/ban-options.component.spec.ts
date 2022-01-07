import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { BanOptions, BanOptionsComponent } from './ban-options.component';

describe('BanOptionsComponent', () => {
  let component: BanOptionsComponent;
  let fixture: ComponentFixture<BanOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BanOptionsComponent],
      imports: [MatAutocompleteModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Control Contract', () => {
    let onChangeFunction: (data: BanOptions) => unknown;
    let onTouchedFunction: () => unknown;

    beforeEach(() => {
      onChangeFunction = jasmine.createSpy('onChangeFunction');
      onChangeFunction = jasmine.createSpy('onTouchFunction');
      component.registerOnChange(onChangeFunction);
      component.registerOnTouched(onTouchedFunction);
    });

    it('should not call onChange when writeValue(data) called', () => {
      component.writeValue(component.defaults as unknown as Record<string, unknown>);
      expect(onChangeFunction).toHaveBeenCalledTimes(0);
    });

    it('should call onChange(data) when changed internally', () => {
      component.formControls.banReason.setValue('Hello, world!');
      expect(onChangeFunction).toHaveBeenCalledTimes(1);
    });

    it('setDisabledState(true)', () => {
      component.setDisabledState(true);
      expect(component.formGroup.disabled).toBeTruthy();
    });

    it('setDisabledState(false)', () => {
      component.setDisabledState(false);
      expect(component.formGroup.disabled).toBeFalsy();
    });
  });

  describe('Form Validation Contract', () => {
    it('(completed form) should be marked valid', () => {
      component.formControls.banReason.setValue('Hello, world!');
      expect(component.validate(null)).toBeFalsy();
    });

    it('(empty ban reason) should be marked invalid', () => {
      component.formControls.banReason.setValue('');
      expect(component.validate(null)).toBeTruthy();
    });

    it('(null ban reason) should be marked invalid', () => {
      component.formControls.banReason.setValue(null);
      expect(component.validate(null)).toBeTruthy();
    });
  });
});
