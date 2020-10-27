import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { takeUntil } from 'rxjs/operators';
import { SunriseComponent } from './sunrise/sunrise.component';

/** User Details page. */
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent extends BaseComponent implements OnInit {
  public gamertag: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sunrise: SunriseService
  ) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$))
      .subscribe(params => {
        this.gamertag = params.get('gamertag');
      });
  }

  /** Update the routed component. */
  public navigate(): void {
    const childComponent = this.route.snapshot.firstChild.component;
    if (childComponent === SunriseComponent) {
      this.router.navigate(['/navbar-app', 'user-details', 'sunrise'], {
        queryParams: { gamertag: this.gamertag },
      });
    }
  }
}
