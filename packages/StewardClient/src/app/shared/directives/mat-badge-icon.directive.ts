import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/** An angular material badge, but it contains an icon */
@Directive({
  selector: '[matBadge][matBadgeIcon]',
})
export class MatBadgeIconDirective implements OnInit {
  /** REVIEW-COMMENT: Mat badge icon. */
  @Input() matBadgeIcon: string;

  constructor(private readonly el: ElementRef) {}

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    // based on https://stackoverflow.com/questions/52161297/angular-material-badge-make-matbadge-contain-an-icon-instead-of-text
    const badge = this.el.nativeElement.querySelector('.mat-badge-content');
    badge.style['font-family'] = 'Material Icons';
  }
}
