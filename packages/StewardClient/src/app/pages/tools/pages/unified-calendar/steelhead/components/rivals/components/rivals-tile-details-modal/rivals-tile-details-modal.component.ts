import { Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { RivalsEvent } from '@services/api-v2/steelhead/rivals/steelhead-rivals.service';

/** Modal component to display a rivals event. */
@Component({
  templateUrl: './rivals-tile-details-modal.component.html',
  styleUrls: ['./rivals-tile-details-modal.component.scss'],
})
export class RivalsTileDetailsModalComponent extends BaseComponent {
  constructor(
    protected dialogRef: MatDialogRef<RivalsTileDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RivalsEvent,
  ) {
    super();
  }
}
