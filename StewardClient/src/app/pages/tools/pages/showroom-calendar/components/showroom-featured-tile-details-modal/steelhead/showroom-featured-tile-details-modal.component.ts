import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import {
  CarFeaturedShowcase,
  CarListing,
  SteelheadShowroomService,
} from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { takeUntil } from 'rxjs';

/** Modal component to display a showroom feature showcase. */
@Component({
  templateUrl: './showroom-featured-tile-details-modal.component.html',
  styleUrls: ['./showroom-featured-tile-details-modal.component.scss'],
})
export class ShowroomFeaturedTileDetailsModalComponent extends BaseComponent implements OnInit {
  public getActionMonitor = new ActionMonitor('GET car sale detail');
  public carSale: CarListing = undefined;

  constructor(
    protected dialogRef: MatDialogRef<ShowroomFeaturedTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CarFeaturedShowcase,
    private readonly steelheadShowroomService: SteelheadShowroomService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.getActionMonitor = this.getActionMonitor.repeat();
    this.steelheadShowroomService
      .getCarListing$(this.data.car.carId)
      .pipe(this.getActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(carListing => {
        this.carSale = carListing;
      });
  }
}
