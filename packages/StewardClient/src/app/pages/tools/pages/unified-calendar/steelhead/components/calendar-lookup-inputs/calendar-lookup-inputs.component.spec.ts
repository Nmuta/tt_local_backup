import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarLookupInputsComponent } from './calendar-lookup-inputs.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { createMockSteelheadPegasusSlotsService } from '@services/api-v2/steelhead/pegasus-slots/steelhead-pegasus-slots.service.mock';

describe('CalendarLookupInputsComponent', () => {
  let component: CalendarLookupInputsComponent;
  let fixture: ComponentFixture<CalendarLookupInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [MatAutocompleteModule],
        declarations: [CalendarLookupInputsComponent],
        providers: [createMockSteelheadPegasusSlotsService()],
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
