import {
  Directive,
  ElementRef,
  forwardRef,
  OnInit,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { STEWARD_DISABLE_STATE_PROVIDER } from '@shared/modules/state-managers/injection-tokens';
import { BasePermissionAttributeDirective } from './permission-attribute.base.directive';
import { intersection } from 'lodash';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `button[mat-button][stateManager][permissionAttribute], button[mat-raised-button][stateManager][permissionAttribute], button[mat-icon-button][stateManager][permissionAttribute],
  button[mat-fab][stateManager][permissionAttribute], button[mat-mini-fab][stateManager][permissionAttribute], button[mat-stroked-button][stateManager][permissionAttribute],
  button[mat-flat-button][stateManager][permissionAttribute]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => ButtonPermissionAttributeDirective),
      multi: true,
    },
  ],
})
export class ButtonPermissionAttributeDirective
  extends BasePermissionAttributeDirective
  implements OnInit
{
  private readonly hideInternalContentButtonClasses = [
    'mat-icon-button',
    'mat-fab',
    'mat-mini-fab',
  ];

  constructor(
    element: ElementRef,
    permAttributesService: PermAttributesService,
    viewContainerRef: ViewContainerRef,
    @Optional() tooltip: MatTooltip,
  ) {
    super(element, permAttributesService, viewContainerRef, tooltip);
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // Hide internal content for certain buttons when permissions are disabled
    this.hideChildElement = intersection(this.hideInternalContentButtonClasses, this.element.nativeElement.classList).length > 0
  }
}
