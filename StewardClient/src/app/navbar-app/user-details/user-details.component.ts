import { Component, OnInit } from '@angular/core';
import { SunriseService } from '@services/sunrise/sunrise.service';

/** User Details page. */
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  constructor(private readonly sunrise: SunriseService) { }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.sunrise.getPlayerDetailsByGamertag("temporary1021").subscribe();
  }
}
