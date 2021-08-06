import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent, ImageModalData } from '@views/image-modal/image-modal.component';

/** Utility directive to enlarge an image on click. */
@Directive({
  selector: 'img[enlargeImage]',
})
export class ClickEnlargeImageDirective {
  @Input() enlargeImage: string;
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
