import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvalidPermissionsComponent } from './components/invalid-permissions/invalid-permissions.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonPermissionAttributeDirective } from './directives/button-permission-attribute.directive';
import { CheckboxPermissionAttributeDirective } from './directives/checkbox-permission-attribute.directive';

/** A feature module that allows a verification checkbox to be bound to other components. */
@NgModule({
  declarations: [
    ButtonPermissionAttributeDirective,
    CheckboxPermissionAttributeDirective,
    InvalidPermissionsComponent,
  ],
  imports: [CommonModule, MatTooltipModule, MatIconModule],
  exports: [ButtonPermissionAttributeDirective, CheckboxPermissionAttributeDirective],
})
export class PermissionsModule {}
