import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SteelheadGroupNotificationManagementComponent } from './steelhead-group-notification-management.component';

describe('SteelheadGroupNotificationManagementComponent', () => {
  let component: SteelheadGroupNotificationManagementComponent;
  let fixture: ComponentFixture<SteelheadGroupNotificationManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadGroupNotificationManagementComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadGroupNotificationManagementComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
