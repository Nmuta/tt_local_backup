import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 *  Verifies switching user in case there are pending perm attribute changes.
 */
@Component({
  selector: 'verify-user-switch-dialog',
  templateUrl: 'verify-user-switch-dialog.component.html',
  styleUrls: ['verify-user-switch-dialog.component.scss'],
})
export class VerifyUserSwitchDialogComponent {
  constructor(public dialogRef: MatDialogRef<VerifyUserSwitchDialogComponent>) {}
}
