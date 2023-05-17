import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { CarFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';

/** Modal component to display a showroom feature showcase. */
@Component({
  templateUrl: './showroom-featured-tile-details-modal.component.html',
  styleUrls: ['./showroom-featured-tile-details-modal.component.scss'],
})
export class ShowroomFeaturedTileDetailsModalComponent extends BaseComponent {
  constructor(
    protected dialogRef: MatDialogRef<ShowroomFeaturedTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CarFeaturedShowcase,
  ) {
    super();
  }
}
