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
import {
  RivalsEventWithEnvironment,
  RivalsTileDetailsModalComponent,
} from './rivals-tile-details-modal.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';
import BigNumber from 'bignumber.js';

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
              id: new BigNumber(faker.datatype.number(0)),
              description: faker.datatype.string(),
              category: faker.datatype.string(),
              startTime: faker.datatype.datetime().toISOString(),
              endTime: faker.datatype.datetime().toISOString(),
              scoreType: undefined,
              scoreTypeId: new BigNumber(faker.datatype.number(0)),
              gameScoreboardId: new BigNumber(faker.datatype.number(0)),
              trackName: faker.datatype.string(),
              trackId: new BigNumber(faker.datatype.number(0)),
              carRestrictions: [],
              leaderboardEnvironmnet: faker.datatype.string(),
            } as RivalsEventWithEnvironment,
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
