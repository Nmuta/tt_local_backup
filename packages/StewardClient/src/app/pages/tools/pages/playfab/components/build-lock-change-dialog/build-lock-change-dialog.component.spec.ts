import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import faker from '@faker-js/faker';
import { toDateTime } from '@helpers/luxon';
import { GameTitle } from '@models/enums';
import { PlayFabBuildSummary } from '@models/playfab';
import { of } from 'rxjs';
import {
  BuildLockChangeDialogComponent,
  BuildLockChangeDialogData,
} from './build-lock-change-dialog.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('BuildLockChangeDialogComponent', () => {
  const model: BuildLockChangeDialogData = {
    gameTitle: GameTitle.FH5,
    build: {
      id: faker.datatype.uuid(),
      name: faker.datatype.string(),
      creationDateUtc: toDateTime(faker.datatype.datetime.toString()),
    } as PlayFabBuildSummary,
    lockBuild: true,
    lockAction$() {
      return of(null);
    },
    unlockAction$() {
      return of(null);
    },
  };

  let fixture: ComponentFixture<BuildLockChangeDialogComponent>;
  let component: BuildLockChangeDialogComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [BuildLockChangeDialogComponent],
        imports: [MatButtonModule, MatDialogModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: { close: () => null },
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: model,
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(BuildLockChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
