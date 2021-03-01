import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { UserBanningBaseComponent } from './user-banning.base.component';

describe('UserBanningBaseComponent', () => {
  let component: UserBanningBaseComponent;
  let fixture: ComponentFixture<UserBanningBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBanningBaseComponent],
      providers: [createMockBackgroundJobService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBanningBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
