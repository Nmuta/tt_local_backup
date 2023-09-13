import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';

import { KustoDataActivitiesComponent } from './kusto-data-activities.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'KustoDataActivitiesComponent', () => {
  let component: KustoDataActivitiesComponent;
  let fixture: ComponentFixture<KustoDataActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [KustoDataActivitiesComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [PipesModule],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KustoDataActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
