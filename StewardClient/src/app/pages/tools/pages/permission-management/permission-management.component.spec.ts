import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { createMockPermissionsService } from '@services/old-permissions';
import { createMockUserService } from '@services/user';
import { PermissionManagementComponent } from './permission-management.component';

describe('PermissionManagementComponent', () => {
  let component: PermissionManagementComponent;
  let fixture: ComponentFixture<PermissionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
        MatDialogModule,
      ],
      declarations: [PermissionManagementComponent],
      providers: [
        createMockBackgroundJobService(),
        createMockUserService(),
        createMockPermissionsService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
