import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
  @ViewChild('modelImage') modelImage: ElementRef;

  public activeRotation: number = 0;

  constructor(
    private dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageModalData,
  ) {}

  /** Rotates the image. */
  public rotate(): void {
    this.activeRotation = (this.activeRotation + 90) % 360;
    this.modelImage.nativeElement.style.transform = `rotate(${this.activeRotation}deg)`;
  }

  /** Close dialog. */
  public close(): void {
    this.dialogRef.close();
  }
}
