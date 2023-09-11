import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { ManufacturerFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';

/** Modal component to display a showroom manufacturer feature showcase. */
@Component({
  templateUrl: './showroom-manufacturer-featured-tile-details-modal.component.html',
  styleUrls: ['./showroom-manufacturer-featured-tile-details-modal.component.scss'],
})
export class ShowroomManufacturerFeaturedTileDetailsModalComponent extends BaseComponent {
  constructor(
    protected dialogRef: MatDialogRef<ShowroomManufacturerFeaturedTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ManufacturerFeaturedShowcase,
  ) {
    super();
  }
}
