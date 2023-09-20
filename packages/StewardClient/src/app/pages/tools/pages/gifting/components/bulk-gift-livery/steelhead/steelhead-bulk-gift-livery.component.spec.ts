import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { SteelheadBulkGiftLiveryComponent } from './steelhead-bulk-gift-livery.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadBulkGiftLiveryComponent', () => {
  let component: SteelheadBulkGiftLiveryComponent;
  let fixture: ComponentFixture<SteelheadBulkGiftLiveryComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
        declarations: [SteelheadBulkGiftLiveryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [...createMockMsalServices(), createMockLoggerService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SteelheadBulkGiftLiveryComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
