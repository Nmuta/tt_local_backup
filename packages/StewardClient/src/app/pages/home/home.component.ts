import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { WindowService } from '@services/window';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UserState } from '@shared/state/user/user.state';
import { DateTime } from 'luxon';
import { Observable, takeUntil } from 'rxjs';

/** Displays the home page splash page. */
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public centerContentsClasses = {};
  public waitOnProfileMonitor = new ActionMonitor('Waiting for user profile to load');

  constructor(
    private readonly windowService: WindowService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const dayOfWeek = DateTime.local().weekday - 1;
    const weekOfYear = DateTime.local().weekNumber;
    const whichBackground = ((weekOfYear + dayOfWeek) % 7) + 1;
    this.centerContentsClasses = { 'text-center': true, [`bg${whichBackground}`]: true };

    UserState.latestValidProfile$(this.profile$)
      .pipe(this.waitOnProfileMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.tryAutoRedirectToToolsHome();
      });
  }

  private tryAutoRedirectToToolsHome(): void {
    // Steward only runs in an iframe on Zendesk
    // Due to that, we can auto-route to tools app we ARE NOT in an iframe
    if (!this.windowService.isInIframe) {
      this.router.navigate(['app', 'tools', 'home'], {
        relativeTo: this.route,
      });
    }
  }
}
