import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  failedTitles: string;
}

/**
 *  Loyalty Rewards failure dialog component
 */
@Component({
  selector: 'loyalty-rewards-failed-dialog',
  templateUrl: 'loyalty-rewards-failed-dialog.component.html',
})
export class LoyaltyRewardsFailedDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
