import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { SunriseUserGroupManagementComponent } from './sunrise-user-group-management.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SunriseUserGroupManagementComponent', () => {
  let component: SunriseUserGroupManagementComponent;
  let fixture: ComponentFixture<SunriseUserGroupManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([]),
        ],
        declarations: [SunriseUserGroupManagementComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [...createMockMsalServices(), createMockLoggerService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SunriseUserGroupManagementComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
