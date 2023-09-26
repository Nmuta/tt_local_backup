import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalDropdownComponent } from './external-dropdown/external-dropdown.component';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AnchorDirective } from './anchor.directive';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

/** Container for various general nav/tile customization features. */
@NgModule({
  declarations: [ExternalDropdownComponent, AnchorDirective],
  imports: [
    CommonModule,
    MatCommonModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [ExternalDropdownComponent, AnchorDirective],
})
export class NavModule {}
