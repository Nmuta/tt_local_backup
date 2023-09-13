import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { ServicesTableStorageComponent } from './services-table-storage.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ServicesTableStorageComponent', () => {
  let component: ServicesTableStorageComponent;
  let fixture: ComponentFixture<ServicesTableStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [RouterTestingModule.withRoutes([]), NgxsModule.forRoot([])],
        declarations: [ServicesTableStorageComponent],
        providers: [createMockSunriseService()],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesTableStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
