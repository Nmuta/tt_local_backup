import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SunrisePlayerInventoryProfilePickerComponent } from './sunrise/sunrise-player-inventory-profile-picker.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Player Inventory Profile -related components.
 */
@NgModule({
  declarations: [SunrisePlayerInventoryProfilePickerComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatChipsModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
  ],
  exports: [
    SunrisePlayerInventoryProfilePickerComponent,
  ]
})
export class PlayerInventoryProfilesModule { }
