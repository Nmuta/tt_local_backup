import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { InvalidPermissionsComponent } from './components/invalid-permissions/invalid-permissions.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonPermissionAttributeDirective } from './directives/button-permission-attribute.directive';
import { CheckboxPermissionAttributeDirective } from './directives/checkbox-permission-attribute.directive';
import { DirectivesModule } from '@shared/directives/directives.module';
import { AnchorPermissionAttributeDirective } from './directives/anchor-permission-attribute.directive';
import { GeneralElementPermissionAttributeDirective } from './directives/general-element-permission-attribute.directive';

/** A feature module that allows a verification checkbox to be bound to other components. */
@NgModule({
  declarations: [
    ButtonPermissionAttributeDirective,
    CheckboxPermissionAttributeDirective,
    AnchorPermissionAttributeDirective,
    GeneralElementPermissionAttributeDirective,
    InvalidPermissionsComponent,
  ],
  imports: [CommonModule, DirectivesModule, MatTooltipModule, MatIconModule],
  exports: [
    ButtonPermissionAttributeDirective,
    CheckboxPermissionAttributeDirective,
    AnchorPermissionAttributeDirective,
    GeneralElementPermissionAttributeDirective,
  ],
})
export class PermissionsModule {}
