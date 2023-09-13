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
import { ManufacturerFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { ShowroomManufacturerFeaturedTileDetailsModalComponent } from './showroom-manufacturer-featured-tile-details-modal.component';
import { DateTime } from 'luxon';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ShowroomManufacturerFeaturedTileDetailsModalComponent', () => {
  let component: ShowroomManufacturerFeaturedTileDetailsModalComponent;
  let fixture: ComponentFixture<ShowroomManufacturerFeaturedTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ShowroomManufacturerFeaturedTileDetailsModalComponent],
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
              manufacturerId: faker.datatype.number(),
              manufacturerName: faker.datatype.string(),
            } as ManufacturerFeaturedShowcase,
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomManufacturerFeaturedTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
