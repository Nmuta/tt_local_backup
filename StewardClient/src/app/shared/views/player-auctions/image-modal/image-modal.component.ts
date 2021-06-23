import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ImageModalData {
  title: string;
  url: string;
}

/** A component that shows an image in a popup modal. */
@Component({
  selector: 'image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent {
  constructor(
    private dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageModalData,
  ) {}

  /** Close dialog. */
  public close(): void {
    this.dialogRef.close();
  }
}
