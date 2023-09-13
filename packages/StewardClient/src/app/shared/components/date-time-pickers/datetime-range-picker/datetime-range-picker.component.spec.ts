import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeRangePickerComponent } from './datetime-range-picker.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'DatetimeRangePickerComponent', () => {
  let component: DatetimeRangePickerComponent;
  let fixture: ComponentFixture<DatetimeRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [DatetimeRangePickerComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
