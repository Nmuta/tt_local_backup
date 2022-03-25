import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseGroupNotificationManagementComponent } from './sunrise-group-notification-management.component';
import { SunriseGroupNotificationManagementContract } from './sunrise-group-notification-management.contract';

describe('SunriseAuctionBlocklistComponent', () => {
  let component: SunriseGroupNotificationManagementComponent;
  let fixture: ComponentFixture<SunriseGroupNotificationManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SunriseGroupNotificationManagementComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SunriseGroupNotificationManagementContract],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseGroupNotificationManagementComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
