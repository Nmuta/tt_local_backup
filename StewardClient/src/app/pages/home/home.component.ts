import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { WindowService } from '@services/window';
import { DateTime } from 'luxon';

/** Displays the home page splash page. */
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit {
  public centerContentsClasses = {};

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

    // Steward only runs in an iframe on Zendesk
    // Due to that, we can auto-route to tools app we ARE NOT in an iframe
    if (!this.windowService.isInIframe) {
      this.router.navigate(['app', 'tools', 'home'], {
        relativeTo: this.route,
      });
    }
  }
}
