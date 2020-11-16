import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Root component for primary app, navigated to from navigation sidebar. */
@Component({
  templateUrl: './navbar-app.html',
  styleUrls: ['./navbar-app.scss'],
})
export class NavbarAppComponent {
  constructor (private readonly router: Router, private readonly route: ActivatedRoute,) { }

  public clearSidebar() {
    // https://github.com/angular/angular/issues/5122
    this.router.navigate([{outlets: { sidebar: null}}], { relativeTo: this.route});
  }
}
