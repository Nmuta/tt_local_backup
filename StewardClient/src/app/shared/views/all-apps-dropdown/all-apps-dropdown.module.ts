import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AllAppsDropdownComponent } from './all-apps-dropdown.component';
import { MatMenuModule } from '@angular/material/menu';

/** Module for a menu drop with links to all Steward apps. */
@NgModule({
  declarations: [AllAppsDropdownComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    FontAwesomeModule,
    RouterModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  exports: [AllAppsDropdownComponent],
})
export class AllAppsDropdownModule {}
