import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
