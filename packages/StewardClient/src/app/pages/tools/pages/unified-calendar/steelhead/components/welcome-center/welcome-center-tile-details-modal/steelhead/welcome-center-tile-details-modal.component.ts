import { Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import {
  TileEventGroup,
  WelcomeCenterMeta,
} from '../../welcome-center-calendar-view/steelhead/steelhead-welcome-center-calendar-view.component';

export type WelcomeCenterTileDetailsModalData = { columns: TileEventGroup<WelcomeCenterMeta>[] };

/** Modal component to display the Racers cup event. */
@Component({
  templateUrl: './welcome-center-tile-details-modal.component.html',
  styleUrls: ['./welcome-center-tile-details-modal.component.scss'],
})
export class WelcomeCenterTileDetailsModalComponent {
  constructor(
    protected dialogRef: MatDialogRef<WelcomeCenterTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WelcomeCenterTileDetailsModalData,
  ) {}
}
