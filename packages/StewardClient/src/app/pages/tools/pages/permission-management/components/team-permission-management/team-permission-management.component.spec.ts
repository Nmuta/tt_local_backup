import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { createMockOldPermissionsService } from '@services/old-permissions';
import { createMockUserService } from '@services/user';
import { TeamPermissionManagementComponent } from './team-permission-management.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('TeamPermissionManagementComponent', () => {
  let component: TeamPermissionManagementComponent;
  let fixture: ComponentFixture<TeamPermissionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([]),
          MatDialogModule,
        ],
        declarations: [TeamPermissionManagementComponent],
        providers: [
          createMockBackgroundJobService(),
          createMockUserService(),
          createMockOldPermissionsService(),
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(TeamPermissionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
