import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { filter, takeUntil } from 'rxjs/operators';
import { renderDelay } from '@helpers/rxjs';
import { GameTitleCodeName } from '@models/enums';

/** User Details page. */
@Component({
  templateUrl: './ac-log-reader.component.html',
  styleUrls: ['./ac-log-reader.component.scss'],
})
export class AcLogReaderComponent extends BaseComponent {
  public steelheadRouterLink = ['.', 'steelhead'];
  public gameTitleCodeName = GameTitleCodeName;

  constructor(router: Router) {
    super();

    router.events
      .pipe(
        renderDelay(),
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        window.dispatchEvent(new Event('resize'));
      });
  }
}
