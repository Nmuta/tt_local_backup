import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { StewardManagementComponent } from './steward-management.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'StewardManagementComponent', () => {
  let component: StewardManagementComponent;
  let fixture: ComponentFixture<StewardManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [StewardManagementComponent],
        providers: [createMockBackgroundJobService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StewardManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
