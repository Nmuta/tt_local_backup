import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, RoutesRecognized } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { flattenRouteChildren } from '@helpers/flatten-route';
import { WindowService } from '@services/window';
import { chain } from 'lodash';
import { filter, takeUntil } from 'rxjs/operators';

/** Root component for primary app, navigated to from navigation sidebar. */
@Component({
  templateUrl: './navbar-app.component.html',
  styleUrls: ['./navbar-app.component.scss'],
})
export class NavbarAppComponent extends BaseComponent implements OnInit {
  public drawerOpened = false;
  private lastSidebarRoute = null;

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
    this.setSidebarState(this.route.snapshot);
  }

  /** Clears the current sidebar outlet path. */
  public clearSidebar(): void {
    // https://github.com/angular/angular/issues/5122
    this.router.navigate([{ outlets: { sidebar: null } }], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
  }

  private registerSidebarStateMachine() {
    this.router.events
      .pipe(
        takeUntil(this.onDestroy$),
        filter(e => e instanceof RoutesRecognized),
      )
      .subscribe((e: RoutesRecognized) => this.setSidebarState(e.state.root));
  }

  private setSidebarState(routeSnapshot: ActivatedRouteSnapshot): void {
    const recognizedSidebarRoute = chain(flattenRouteChildren(routeSnapshot))
      .filter(child => child.outlet === 'sidebar')
      .first()
      .value();
    if (!recognizedSidebarRoute) {
      this.drawerOpened = false;
      this.lastSidebarRoute = null;
      return;
    }

    const recognizedSidebarPath = chain(recognizedSidebarRoute.pathFromRoot)
      .filter(p => p.outlet === 'sidebar')
      .flatMap(p => p.url)
      .value()
      .join('/');
    const newRouteMatchesOldRoute = this.lastSidebarRoute === recognizedSidebarPath;

    if (newRouteMatchesOldRoute) {
      this.drawerOpened = false;
      this.lastSidebarRoute = null;
    } else {
      this.drawerOpened = !!recognizedSidebarRoute;
      this.lastSidebarRoute = recognizedSidebarPath;
    }
  }
}
