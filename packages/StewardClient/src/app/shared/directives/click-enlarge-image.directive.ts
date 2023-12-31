import { Directive, HostListener, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ImageModalComponent, ImageModalData } from '@views/image-modal/image-modal.component';

/** Utility directive to enlarge an image on click. */
@Directive({
  selector: 'img[enlargeImage]',
})
export class ClickEnlargeImageDirective {
  /** REVIEW-COMMENT: Enlarge image. */
  @Input() enlargeImage: string;
  /** REVIEW-COMMENT: Image title. */
  @Input() title: string;

  constructor(private readonly dialog: MatDialog) {}

  /** Click event listener. */
  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    event.stopPropagation();

    this.dialog.open(ImageModalComponent, {
      data: { title: this.title, url: this.enlargeImage } as ImageModalData,
    });
  }
}
