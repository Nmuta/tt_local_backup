import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionAttributeButtonDirective } from './directives/button-permission-attribute.directive';
import { PermissionAttributeCheckboxDirective } from './directives/checkbox-permission-attribute.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvalidPermissionsComponent } from './components/invalid-permissions/invalid-permissions.component';
import { MatIconModule } from '@angular/material/icon';

/** A feature module that allows a verification checkbox to be bound to other components. */
@NgModule({
  declarations: [PermissionAttributeButtonDirective, PermissionAttributeCheckboxDirective, InvalidPermissionsComponent],
  imports: [CommonModule, MatTooltipModule, MatIconModule],
  exports: [PermissionAttributeButtonDirective, PermissionAttributeCheckboxDirective],
})
export class PermissionsModule {}
