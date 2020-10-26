import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { SunriseComponent } from './sunrise/sunrise.component';

/** User Details page. */
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  public gamertag: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sunrise: SunriseService
  ) { }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.sunrise.getPlayerDetailsByGamertag("temporary1021").subscribe();
  }

  /** Update the routed component. */
  public navigate(): void {
    const childComponent = this.route.snapshot.firstChild.component;
    if (childComponent === SunriseComponent) {
      this.router.navigate(['/navbar-app', 'user-details', 'sunrise', this.gamertag])
    }
  }
}
