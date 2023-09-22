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
import { RivalsTileDetailsModalComponent } from './rivals-tile-details-modal.component';
import { RivalsEvent } from '@services/api-v2/steelhead/rivals/steelhead-rivals.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('RivalsTileDetailsModalComponent', () => {
  let component: RivalsTileDetailsModalComponent;
  let fixture: ComponentFixture<RivalsTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [RivalsTileDetailsModalComponent],
        imports: [MatDialogModule, PipesModule, HttpClientTestingModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: { close: () => null, beforeClosed: () => of() },
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              name: faker.datatype.string(),
              description: faker.datatype.string(),
              category: faker.datatype.string(),
              startTime: faker.datatype.datetime().toISOString(),
              endTime: faker.datatype.datetime().toISOString(),
              scoreType: undefined,
              trackName: faker.datatype.string(),
            } as RivalsEvent,
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RivalsTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
