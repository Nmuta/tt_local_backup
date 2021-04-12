import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';
import { Clipboard } from '@helpers/clipboard';

/**
 *
 */
@Directive({
  selector: '[hoverToCopy]',
})
export class HoverToCopyDirective {
  @HostBinding('style.cursor') cursor = 'pointer';
  @HostBinding('style.display') display = 'inline-block';
  @HostBinding('style.user-select') userSelect = 'none';

  @Input() hoverToCopy: string;

  private tooltip: HTMLElement;
  private tooltipTitle: string = 'Click to Copy';
  private tooltipClicked: string = 'Copied';

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
    private readonly clipboard: Clipboard,
  ) {}

  /** Click event. */
  @HostListener('click', ['$event'])
  public onClick(_event: Event): void {
    this.clipboard.copyMessage(this.hoverToCopy);
    this.tooltip.textContent = this.tooltipClicked;
  }

  /**
    Event for mouse enter
   */
  @HostListener('mouseenter') mouseover(): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'opacity', '.1');

    if (!this.tooltip) {
      this.show();
    }
  }

  /**
    Event for mouse leave.
   */
  @HostListener('mouseleave') mouseleave(): void {
    this.renderer.removeStyle(this.elementRef.nativeElement, 'opacity');

    if (this.tooltip) {
      this.hide();
    }
  }

  /**
    Show the copy button.
   */
  private show(): void {
    this.create();
    this.setPosition();
  }

  /**
    Hide the copy button.
   */
  private hide(): void {
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = null;
  }

  /**
   Create the copy button.
   */
  private create(): void {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(this.tooltip, this.renderer.createText(this.tooltipTitle));

    this.renderer.appendChild(document.body, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
  }

  /**
   Set the position.
   */
  private setPosition(): void {
    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();

    const scrollPos =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    const top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
