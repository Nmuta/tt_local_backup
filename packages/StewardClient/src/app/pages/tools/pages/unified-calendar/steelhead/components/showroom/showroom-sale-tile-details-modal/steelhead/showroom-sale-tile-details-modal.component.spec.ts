import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import { ShowroomSaleTileDetailsModalComponent } from './showroom-sale-tile-details-modal.component';
import faker from '@faker-js/faker';
import { CarSale } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { toDateTime } from '@helpers/luxon';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ShowroomSaleTileDetailsModalComponent', () => {
  let component: ShowroomSaleTileDetailsModalComponent;
  let fixture: ComponentFixture<ShowroomSaleTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ShowroomSaleTileDetailsModalComponent],
        imports: [MatDialogModule, PipesModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: { close: () => null, beforeClosed: () => of() },
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              startTimeUtc: toDateTime(faker.date.past()),
              endTimeUtc: toDateTime(faker.date.future()),
            } as CarSale,
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomSaleTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
