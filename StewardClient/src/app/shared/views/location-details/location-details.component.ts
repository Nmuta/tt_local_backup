import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowService } from '@services/window';

/** Displays the apps current routed location. */
@Component({
  selector: 'location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
})
export class LocationDetailsComponent {
  constructor(
    private readonly windowService: WindowService,
    private readonly route: ActivatedRoute,
  ) {}

  /** Produces the current location, for reference when in iframe. */
  public get pathname(): string {
    return this.windowService.location().pathname;
  }

  /** Produces the current location, for reference when in iframe. */
  public get queryParams(): string[] {
    const queryParams = this.route.snapshot.queryParams;
    const stringParams = [];
    for (const param in queryParams) {
      if (queryParams.hasOwnProperty(param)) {
        stringParams.push(`[${param}] ${queryParams[param]}`);
      }
    }

    return stringParams;
  }

  /** Produces the current location, for reference when in iframe. */
  public get location(): string {
    return `${this.windowService.location().pathname}${this.windowService.location()}`;
  }
}
