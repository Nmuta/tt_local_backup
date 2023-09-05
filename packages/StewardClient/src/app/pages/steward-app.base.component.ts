import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, RoutesRecognized } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { flattenRouteChildren } from '@helpers/flatten-route';
import { LogTopic, LoggerService, TopicLogger } from '@services/logger';
import { chain, startsWith } from 'lodash';
import { filter, takeUntil } from 'rxjs/operators';

/** Steward Base component for primary apps, manages the angular material sidebar. */
@Component({
  template: '',
})
export class StewardAppBaseComponent extends BaseComponent implements OnInit {
  private readonly logger: TopicLogger;
  public drawerOpened = false;
  private lastSidebarRoute = null;

  constructor(
    private loggerService: LoggerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    super();
    this.logger = this.loggerService.makeTopicLogger([LogTopic.Sidebar]);
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
    this.logger.log('registerSidebarStateMachine: start');
    this.router.events
      .pipe(
        filter(e => e instanceof RoutesRecognized),
        takeUntil(this.onDestroy$),
      )
      .subscribe((e: RoutesRecognized) => {
        this.logger.log('registerSidebarStateMachine: RoutesRecognized', e)
        this.setSidebarState(e.state.root);
      });
  }

  private setSidebarState(routeSnapshot: ActivatedRouteSnapshot): void {
    this.logger.log('setSidebarState: start', routeSnapshot);

    const flattenedRoute = flattenRouteChildren(routeSnapshot);
    this.logger.log('setSidebarState: flattenedRoute', flattenedRoute);

    const recognizedSidebarRoute = chain(flattenedRoute)
      .filter(child => {
        const targetsSidebar = child.outlet === 'sidebar';
        return targetsSidebar;
      })
      .first()
      .value();
    const flattenedSidebarRoute = flattenRouteChildren(recognizedSidebarRoute);

    if (!recognizedSidebarRoute) {
      this.logger.log('setSidebarState: route not recognized as sidebar route', 'Closing sidebar and clearing path', flattenedSidebarRoute);
      this.drawerOpened = false;
      this.lastSidebarRoute = null;
      return;
    }

    this.logger.log('setSidebarState: route recognized as sidebar route', flattenedRoute);
;
    const recognizedSidebarPath = flattenedSidebarRoute.flatMap(p => p.url).join('/');
    this.logger.log('setSidebarState: comparing sidebar paths', this.lastSidebarRoute, flattenedSidebarRoute)

    // Special Case: same route; so we will "toggle" it closed
    const newRouteMatchesOldRoute = this.lastSidebarRoute === recognizedSidebarPath;
    if (newRouteMatchesOldRoute) {
      this.logger.log('setSidebarState: routes match', 'Closing sidebar and clearing path', recognizedSidebarPath);
      this.drawerOpened = false;
      this.lastSidebarRoute = null;
      return;
    }

    // Special Case: navigating to root route; so we will "toggle" the whole sidebar closed. Designed for unified sidebar
    const navigatingToRoot = !recognizedSidebarPath.includes('/');
    if (navigatingToRoot) {
      const newRouteIsSameRoot = startsWith(this.lastSidebarRoute, recognizedSidebarPath);
      if (newRouteIsSameRoot) {
        this.logger.log('setSidebarState: navigating to same root', 'Closing sidebar and clearing path', this.lastSidebarRoute, recognizedSidebarPath);
        this.drawerOpened = false;
        this.lastSidebarRoute = null;
        return;
      }
    }

    // Default: If we did not hit a special case, set the Drawer state based on navigation
    this.logger.log('setSidebarState: no special case', 'Setting state based on existence of sidebar route', this.lastSidebarRoute, recognizedSidebarPath);
    this.drawerOpened = !!recognizedSidebarRoute;
    this.lastSidebarRoute = recognizedSidebarPath;

    this.logger.log('setSidebarState: end', routeSnapshot);
  }
}
