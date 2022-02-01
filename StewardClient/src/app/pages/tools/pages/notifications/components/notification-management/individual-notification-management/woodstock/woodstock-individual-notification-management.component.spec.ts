import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockIndividualNotificationManagementComponent } from './woodstock-individual-notification-management.component';
import { WoodstockIndividualNotificationManagementContract } from './woodstock-individual-notification-management.contract';

describe('SunriseAuctionBlocklistComponent', () => {
  let component: WoodstockIndividualNotificationManagementComponent;
  let fixture: ComponentFixture<WoodstockIndividualNotificationManagementComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [WoodstockIndividualNotificationManagementComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [WoodstockIndividualNotificationManagementContract],
      }).compileComponents();

      fixture = TestBed.createComponent(WoodstockIndividualNotificationManagementComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
