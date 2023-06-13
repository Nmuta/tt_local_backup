import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { CarFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';

/** Modal component to display a showroom car feature showcase. */
@Component({
  templateUrl: './showroom-car-featured-tile-details-modal.component.html',
  styleUrls: ['./showroom-car-featured-tile-details-modal.component.scss'],
})
export class ShowroomCarFeaturedTileDetailsModalComponent extends BaseComponent {
  constructor(
    protected dialogRef: MatDialogRef<ShowroomCarFeaturedTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CarFeaturedShowcase,
  ) {
    super();
  }
}
