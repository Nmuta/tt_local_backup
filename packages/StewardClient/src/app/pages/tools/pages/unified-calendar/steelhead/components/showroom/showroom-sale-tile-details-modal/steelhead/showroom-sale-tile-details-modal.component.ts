import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CarSale } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';

/** Modal component to display a showroom sale. */
@Component({
  templateUrl: './showroom-sale-tile-details-modal.component.html',
  styleUrls: ['./showroom-sale-tile-details-modal.component.scss'],
})
export class ShowroomSaleTileDetailsModalComponent {
  constructor(
    protected dialogRef: MatDialogRef<ShowroomSaleTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CarSale,
  ) {}
}
