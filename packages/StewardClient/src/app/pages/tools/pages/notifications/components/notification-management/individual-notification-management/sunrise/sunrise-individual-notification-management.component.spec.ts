import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseIndividualNotificationManagementComponent } from './sunrise-individual-notification-management.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SunriseAuctionBlocklistComponent', () => {
  let component: SunriseIndividualNotificationManagementComponent;
  let fixture: ComponentFixture<SunriseIndividualNotificationManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [SunriseIndividualNotificationManagementComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SunriseIndividualNotificationManagementComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
