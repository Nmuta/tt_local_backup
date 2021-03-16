import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { flattenRouteChildren } from '@helpers/flatten-route';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { WindowService } from '@services/window';
import { ZendeskService } from '@shared/services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import { chain } from 'lodash';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/** Coordination component for for ticket-app. */
@Component({
  templateUrl: './ticket-app.component.html',
  styleUrls: ['./ticket-app.component.scss'],
})
export class TicketAppComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public loading: boolean;
  public profile: UserModel;

  public drawerOpened = false;
  private lastSidebarRoute = null;

  constructor(
    private readonly zendesk: ZendeskService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly windowService: WindowService,
  ) {
    super();
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.registerSidebarStateMachine();
    this.setSidebarState(this.route.snapshot);

    this.loading = true;
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.profile = profile;
        },
        _error => {
          this.loading = false;
        },
      );
  }

  /** Logic for the AfterViewInit component lifecycle. */
  public ngAfterViewInit(): void {
    this.zendesk.resize$('100%', '500px').subscribe();
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
