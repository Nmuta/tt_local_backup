import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StewardUserComponent } from './steward-user.component';

/** Module for displaying the app's route location. */
@NgModule({
  declarations: [StewardUserComponent],
  imports: [CommonModule],
  exports: [StewardUserComponent],
})
export class StewardUserModule {}
