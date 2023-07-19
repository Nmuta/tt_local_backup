import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { SteelheadUserGroupManagementComponent } from './steelhead-user-group-management.component';

describe('SteelheadUserGroupManagementComponent', () => {
  let component: SteelheadUserGroupManagementComponent;
  let fixture: ComponentFixture<SteelheadUserGroupManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [SteelheadUserGroupManagementComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadUserGroupManagementComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
