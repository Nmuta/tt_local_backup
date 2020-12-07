import {Directive, HostListener} from '@angular/core';

/** Utility directive to prevent click propogation on buttons and the like. */
@Directive({
    selector: '[clickStop]'
})
export class ClickStopDirective
{
  /** Click event listener. */
  @HostListener('click', ['$event'])
  public onClick(event: Event): void
  {
    event.stopPropagation();
  }
}