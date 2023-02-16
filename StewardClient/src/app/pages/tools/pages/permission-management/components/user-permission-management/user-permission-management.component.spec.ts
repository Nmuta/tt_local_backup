import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { createMockOldPermissionsService } from '@services/old-permissions';
import { createMockUserService } from '@services/user';
import { UserPermissionManagementComponent } from './user-permission-management.component';

describe('UserPermissionManagementComponent', () => {
  let component: UserPermissionManagementComponent;
  let fixture: ComponentFixture<UserPermissionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
        MatDialogModule,
      ],
      declarations: [UserPermissionManagementComponent],
      providers: [
        createMockBackgroundJobService(),
        createMockUserService(),
        createMockOldPermissionsService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPermissionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
