import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockGroupNotificationManagementComponent } from './woodstock-group-notification-management.component';
import { WoodstockGroupNotificationManagementContract } from './woodstock-group-notification-management.contract';

describe('SunriseAuctionBlocklistComponent', () => {
  let component: WoodstockGroupNotificationManagementComponent;
  let fixture: ComponentFixture<WoodstockGroupNotificationManagementComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [WoodstockGroupNotificationManagementComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [WoodstockGroupNotificationManagementContract],
      }).compileComponents();

      fixture = TestBed.createComponent(WoodstockGroupNotificationManagementComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
