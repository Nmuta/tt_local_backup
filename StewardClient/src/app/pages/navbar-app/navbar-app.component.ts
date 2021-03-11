import { ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivationEnd, NavigationEnd, NavigationStart } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { WindowService } from '@services/window';
import { filter, takeUntil } from 'rxjs/operators';

/** Root component for primary app, navigated to from navigation sidebar. */
@Component({
  templateUrl: './navbar-app.component.html',
  styleUrls: ['./navbar-app.component.scss'],
})
export class NavbarAppComponent extends BaseComponent {
  @ViewChild('drawer') public drawer: MatDrawer;
  public drawerOpened = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly windowService: WindowService,
  ) {
    super();
    this.registerSidebarStateMachine();
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
    let isNavigating = true;
    let routedToSidebar = false;

    // initialize state on each navigation request.
    this.router.events.pipe(
      takeUntil(this.onDestroy$),
      filter(e => e instanceof NavigationStart),
    ).subscribe(() => {
      isNavigating = true;
      routedToSidebar = false;
    });

    // mark state to incidate we have navigated to a sidebar when one is loaded
    this.router.events.pipe(
      takeUntil(this.onDestroy$),
      filter(e => e instanceof ActivationEnd),
      filter((e: ActivationEnd) => e.snapshot.outlet === 'sidebar')
    ).subscribe(() => routedToSidebar = true);
    
    // clear and resolve the sidebar navigation state
    this.router.events.pipe(
      takeUntil(this.onDestroy$),
      filter(e => e instanceof NavigationEnd),
    ).subscribe(() => {
      if (isNavigating) {
        if (routedToSidebar) {
          this.drawerOpened = true;
        } else {
          this.drawerOpened = false;
        }

        routedToSidebar = false;
        isNavigating = false;
      }
    });
  }
}
