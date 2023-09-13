import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GiftHistoryResultsCompactComponent } from './gift-history-results-compact.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'GiftHistoryResultsCompactComponent', () => {
  let component: GiftHistoryResultsCompactComponent;
  let fixture: ComponentFixture<GiftHistoryResultsCompactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [],
        declarations: [GiftHistoryResultsCompactComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(GiftHistoryResultsCompactComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
