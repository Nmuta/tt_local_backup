import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { PermisisionManagementComponent } from './permission-management.component';

describe('PermisisionManagementComponent', () => {
  let component: PermisisionManagementComponent;
  let fixture: ComponentFixture<PermisisionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermisisionManagementComponent],
      providers: [createMockBackgroundJobService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PermisisionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
