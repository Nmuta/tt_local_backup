import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockNotificationManagementComponent } from './woodstock-notification-management.component';
import { WoodstockNotificationManagementService } from './woodstock-notification-management.service';

describe('SunriseAuctionBlocklistComponent', () => {
  let component: WoodstockNotificationManagementComponent;
  let fixture: ComponentFixture<WoodstockNotificationManagementComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [WoodstockNotificationManagementComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [WoodstockNotificationManagementService],
      }).compileComponents();

      fixture = TestBed.createComponent(WoodstockNotificationManagementComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
