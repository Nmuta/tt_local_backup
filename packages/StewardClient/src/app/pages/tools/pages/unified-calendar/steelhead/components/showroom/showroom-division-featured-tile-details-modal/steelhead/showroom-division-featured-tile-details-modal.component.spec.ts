import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import faker from '@faker-js/faker';
import { DivisionFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { ShowroomDivisionFeaturedTileDetailsModalComponent } from './showroom-division-featured-tile-details-modal.component';
import { DateTime } from 'luxon';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ShowroomDivisionFeaturedTileDetailsModalComponent', () => {
  let component: ShowroomDivisionFeaturedTileDetailsModalComponent;
  let fixture: ComponentFixture<ShowroomDivisionFeaturedTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ShowroomDivisionFeaturedTileDetailsModalComponent],
        imports: [MatDialogModule, PipesModule, HttpClientTestingModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: { close: () => null, beforeClosed: () => of() },
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              title: faker.datatype.string(),
              description: faker.datatype.string(),
              startTimeUtc: DateTime.fromJSDate(faker.datatype.datetime()),
              endTimeUtc: DateTime.fromJSDate(faker.datatype.datetime()),
              divisionId: faker.datatype.number(),
              divisionName: faker.datatype.string(),
            } as DivisionFeaturedShowcase,
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomDivisionFeaturedTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
