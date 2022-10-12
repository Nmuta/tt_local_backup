import { Component } from '@angular/core';
import { SimpleCar } from '@models/cars';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import { AuctionsFiltersBaseComponent } from '../auction-filters.base.component';

/** Sunrise gift basket. */
@Component({
  selector: 'sunrise-auction-filters',
  templateUrl: '../auction-filters.component.html',
  styleUrls: ['../auction-filters.component.scss'],
})
export class SunriseAuctionFiltersComponent extends AuctionsFiltersBaseComponent {
  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** Gets master inventory list */
  public getSimpleCars$(): Observable<SimpleCar[]> {
    return this.sunriseService.getSimpleCars$();
  }
}
