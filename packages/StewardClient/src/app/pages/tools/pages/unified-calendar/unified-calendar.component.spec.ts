import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { UnifiedCalendarComponent } from './unified-calendar.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('UnifiedCalendarComponent', () => {
  let component: UnifiedCalendarComponent;
  let fixture: ComponentFixture<UnifiedCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [UnifiedCalendarComponent],
        providers: [createMockBackgroundJobService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(UnifiedCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
