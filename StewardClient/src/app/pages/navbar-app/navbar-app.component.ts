import { ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivationEnd, NavigationEnd, NavigationStart, ResolveEnd, RoutesRecognized } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { flattenRouteChildren } from '@helpers/flatten-route';
import { WindowService } from '@services/window';
import { filter, takeUntil } from 'rxjs/operators';

/** Root component for primary app, navigated to from navigation sidebar. */
@Component({
  templateUrl: './navbar-app.component.html',
  styleUrls: ['./navbar-app.component.scss'],
})
export class NavbarAppComponent extends BaseComponent implements OnInit {
  @ViewChild('drawer') public drawer: MatDrawer;
  public drawerOpened = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly windowService: WindowService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.registerSidebarStateMachine();
    if (flattenRouteChildren(this.route.snapshot).some(child => child.outlet === 'sidebar')) {
      this.drawerOpened = true;
    }
  }

  /** Clears the current sidebar outlet path. */
  public clearSidebar(): void {
    // https://github.com/angular/angular/issues/5122
    this.router.navigate([{ outlets: { sidebar: null } }], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
  }

  /** Produces the current location, for reference when in iframe. */
  public get location(): string {
    return `${this.windowService.location().pathname}${this.windowService.location().search}`;
  }

  private registerSidebarStateMachine() {
    this.router.events.pipe(
      takeUntil(this.onDestroy$),
      filter(e => e instanceof RoutesRecognized),
    ).subscribe((e: RoutesRecognized) => {
      const recognizedSidebarRoute = flattenRouteChildren(e.state.root).some(child => child.outlet === 'sidebar');
      this.drawerOpened = recognizedSidebarRoute;
    });
  }
}
