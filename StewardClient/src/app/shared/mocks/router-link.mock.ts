import { Directive, HostListener, Input } from "@angular/core";

/**
 * Mock routerLink directive.
 * @see https://angular.io/guide/testing-components-scenarios#components-with-routerlink
 */
@Directive({
  selector: '[routerLink]'
})
export class RouterLinkMock {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}