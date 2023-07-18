import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { DivisionFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';

/** Modal component to display a showroom division feature showcase. */
@Component({
  templateUrl: './showroom-division-featured-tile-details-modal.component.html',
  styleUrls: ['./showroom-division-featured-tile-details-modal.component.scss'],
})
export class ShowroomDivisionFeaturedTileDetailsModalComponent extends BaseComponent {
  constructor(
    protected dialogRef: MatDialogRef<ShowroomDivisionFeaturedTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DivisionFeaturedShowcase,
  ) {
    super();
  }
}
