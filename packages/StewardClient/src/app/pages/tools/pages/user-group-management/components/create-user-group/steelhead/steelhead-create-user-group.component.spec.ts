import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { SteelheadCreateUserGroupComponent } from './steelhead-create-user-group.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadCreateUserGroupComponent', () => {
  let component: SteelheadCreateUserGroupComponent;
  let fixture: ComponentFixture<SteelheadCreateUserGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
        declarations: [SteelheadCreateUserGroupComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [...createMockMsalServices(), createMockLoggerService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SteelheadCreateUserGroupComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
