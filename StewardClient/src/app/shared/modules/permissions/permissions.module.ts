import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionAttributeDirective } from './directives/permission-attribute.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvalidPermissionsComponent } from './components/invalid-permissions/invalid-permissions.component';
import { MatIconModule } from '@angular/material/icon';

/** A feature module that allows a verification checkbox to be bound to other components. */
@NgModule({
  declarations: [
    PermissionAttributeDirective,
    InvalidPermissionsComponent,
  ],
  imports: [CommonModule, MatTooltipModule, MatIconModule],
  exports: [PermissionAttributeDirective],
})
export class PermissionsModule {}
