import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import faker from '@faker-js/faker';
import { ImageModalComponent, ImageModalData } from './image-modal.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ImageModalComponent', () => {
  const model: ImageModalData = {
    title: faker.random.word(),
    url: faker.random.word(),
  };

  let fixture: ComponentFixture<ImageModalComponent>;
  let component: ImageModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ImageModalComponent],
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

    fixture = TestBed.createComponent(ImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: close', () => {
    it('Should call mockMatDialogRef.close', () => {
      component.close();

      expect(mockMatDialogRef.close).toHaveBeenCalled();
    });
  });
});
