import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SteelheadRivalsCalendarViewComponent } from './steelhead-rivals-calendar-view.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadRivalsCalendarViewComponent', () => {
  let component: SteelheadRivalsCalendarViewComponent;
  let fixture: ComponentFixture<SteelheadRivalsCalendarViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          MatDialogModule,
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
        ],
        declarations: [SteelheadRivalsCalendarViewComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SteelheadRivalsCalendarViewComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
