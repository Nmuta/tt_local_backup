import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { Clipboard } from '@helpers/clipboard';

@Directive({
  selector: '[hoverToCopy]',
  host: {
    '[style.cursor]': '"pointer"',
    '[style.display]': '"inline-block"',
    '[style.user-select]': '"none"',
  }
})
export class HoverToCopyDirective {
  @Input() hoverToCopy: string;

  private tooltip: HTMLElement
  private tooltipTitle: string = "Click to Copy";
  private tooltipClicked: string = "Copied";

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private clipboard: Clipboard) {}

  /** CLick event. */
  @HostListener('click', ['$event'])
  public onClick(_event: Event): void {
    this.clipboard.copyMessage(this.hoverToCopy);
    this.tooltip.textContent = this.tooltipClicked;
  }

  @HostListener('mouseenter') mouseover(){
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      "opacity",
      ".1"
    );

    if (!this.tooltip) { this.show(); }
  }

  @HostListener('mouseleave') mouseleave(){
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      "opacity",
      "1"
    );

    if (this.tooltip) { this.hide(); }
  }

  show() {
    this.create();
    this.setPosition();
  }

  hide() {
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = null;
  }

  create() {
    this.tooltip = this.renderer.createElement('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle)
    );

    this.renderer.appendChild(document.body, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
  }

  setPosition() {
    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();

    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top, left;

    top = top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
    left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
  
}
