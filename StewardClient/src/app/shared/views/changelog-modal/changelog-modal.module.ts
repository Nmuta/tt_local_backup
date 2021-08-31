import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ChangelogModule } from '@views/changelog/changelog.module';
import { ChangelogModalComponent } from './changelog-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HideChangelogModalCheckboxModule } from '@views/hide-changelog-modal-checkbox/hide-changelog-modal-checkbox.module';

/** Module for the changelog modal. */
@NgModule({
  declarations: [ChangelogModalComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ChangelogModule,
    HideChangelogModalCheckboxModule,
  ],
  exports: [ChangelogModalComponent],
})
export class ChangelogModalModule {}
