import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseNotificationManagementComponent } from './sunrise-notification-management.component';
import { SunriseNotificationManagementService } from './sunrise-notification-management.service';

describe('SunriseAuctionBlocklistComponent', () => {
  let component: SunriseNotificationManagementComponent;
  let fixture: ComponentFixture<SunriseNotificationManagementComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [SunriseNotificationManagementComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [SunriseNotificationManagementService],
      }).compileComponents();

      fixture = TestBed.createComponent(SunriseNotificationManagementComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
