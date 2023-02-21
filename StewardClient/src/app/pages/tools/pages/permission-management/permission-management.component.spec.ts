import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { PermissionManagementComponent } from './permission-management.component';

describe('PermissionManagementComponent', () => {
  let component: PermissionManagementComponent;
  let fixture: ComponentFixture<PermissionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PermissionManagementComponent],
      providers: [createMockBackgroundJobService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
