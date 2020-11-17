import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Root component for primary app, navigated to from navigation sidebar. */
@Component({
  templateUrl: './navbar-app.component.html',
  styleUrls: ['./navbar-app.component.scss'],
})
export class NavbarAppComponent {
  constructor (private readonly router: Router, private readonly route: ActivatedRoute,) { }

  /** Clears the current sidebar outlet path. */
  public clearSidebar(): void {
    // https://github.com/angular/angular/issues/5122
    this.router.navigate([{outlets: { sidebar: null }}], { relativeTo: this.route});
  }

  /** Produces the current location, for reference when in iframe. */
  public get location(): string {
    return `${window.location.pathname}${window.location.search}`;
  }
}
