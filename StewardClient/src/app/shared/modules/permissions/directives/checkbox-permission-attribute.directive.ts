import { Directive, ElementRef, forwardRef, Optional, ViewContainerRef } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { STEWARD_DISABLE_STATE_PROVIDER } from '@shared/modules/state-managers/injection-tokens';
import { BasePermissionAttributeDirective } from './permission-attribute.bae.directive';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `mat-checkbox[stateManager][permissionAttribute]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => CheckboxPermissionAttributeDirective),
      multi: true,
    },
  ],
})
export class CheckboxPermissionAttributeDirective extends BasePermissionAttributeDirective {
  constructor(
    element: ElementRef,
    permAttributesService: PermAttributesService,
    viewContainerRef: ViewContainerRef,
    @Optional() tooltip: MatTooltip,
  ) {
    super(element, permAttributesService, viewContainerRef, tooltip);
  }
}
