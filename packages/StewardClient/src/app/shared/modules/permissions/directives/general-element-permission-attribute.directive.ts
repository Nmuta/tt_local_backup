import {
  Directive,
  ElementRef,
  forwardRef,
  Optional,
  ViewContainerRef,
  OnChanges,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { STEWARD_DISABLE_STATE_PROVIDER } from '@shared/modules/state-managers/injection-tokens';
import {
  BasePermissionAttributeDirective,
  InvalidPermActionType,
} from './permission-attribute.base.directive';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `div[stateManager][permissionAttribute], span[stateManager][permissionAttribute]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => GeneralElementPermissionAttributeDirective),
      multi: true,
    },
  ],
})
export class GeneralElementPermissionAttributeDirective
  extends BasePermissionAttributeDirective
  implements OnChanges
{
  public;
  constructor(
    element: ElementRef,
    permAttributesService: PermAttributesService,
    viewContainerRef: ViewContainerRef,
    @Optional() tooltip: MatTooltip,
  ) {
    super(element, permAttributesService, viewContainerRef, tooltip);

    this.permissionInvalidActionType = InvalidPermActionType.Hide;
  }

  /** Lifecycle hook. */
  public ngOnChanges(
    changes: BetterSimpleChanges<GeneralElementPermissionAttributeDirective>,
  ): void {
    if (
      changes.permissionInvalidActionType &&
      changes.permissionInvalidActionType.currentValue === InvalidPermActionType.Disable
    ) {
      throw new Error(
        `GeneralElementPermissionAttributeDirective does not support the permissionInvalidActionType of ${InvalidPermActionType.Disable}`,
      );
    }
  }
}
