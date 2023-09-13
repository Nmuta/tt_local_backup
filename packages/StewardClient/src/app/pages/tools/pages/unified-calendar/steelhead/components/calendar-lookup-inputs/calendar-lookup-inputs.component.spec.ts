import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarLookupInputsComponent } from './calendar-lookup-inputs.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'CalendarLookupInputsComponent', () => {
  let component: CalendarLookupInputsComponent;
  let fixture: ComponentFixture<CalendarLookupInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [CalendarLookupInputsComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarLookupInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
