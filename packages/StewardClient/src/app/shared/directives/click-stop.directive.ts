import { Directive, ElementRef, HostListener } from '@angular/core';

/** Utility directive to prevent click propogation on buttons and the like. */
@Directive({
  selector: '[clickStop]',
})
export class ClickStopDirective {
  private readonly elementsAllowDefault: string[] = ['mat-checkbox', 'a'];

  constructor(private elementRef: ElementRef) {}

  /** Click event listener. */
  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    // Certain mat-elements require default click behavior
    // due to the way the underlying elements are structured
    if (this.shouldPreventDefault()) {
      event.preventDefault();
    }
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  private shouldPreventDefault(): boolean {
    const elementTagName: string = this.elementRef?.nativeElement?.tagName || null;

    return this.elementsAllowDefault.findIndex(e => e === elementTagName.toLowerCase()) < 0;
  }
}
