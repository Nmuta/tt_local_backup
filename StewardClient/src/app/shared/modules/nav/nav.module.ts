import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalDropdownComponent } from './external-dropdown/external-dropdown.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AnchorDirective } from './anchor.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

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
