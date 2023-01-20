import {
  Directive,
  ElementRef,
  forwardRef,
  Input,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { BaseDirective } from '@components/base-component/base.directive';
import { HCI } from '@environments/environment';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import {
  DisableStateProvider,
  STEWARD_DISABLE_STATE_PROVIDER,
} from '@shared/modules/state-managers/injection-tokens';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { InvalidPermissionsComponent } from '../components/invalid-permissions/invalid-permissions.component';

export enum InvalidPermActionType {
  Disable,
  Hide,
}

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => BasePermissionAttributeDirective),
      multi: true,
    },
  ],
})
export abstract class BasePermissionAttributeDirective
  extends BaseDirective
  implements DisableStateProvider
{
  public overrideDisable: boolean = undefined;
  public overrideDisable$ = new BehaviorSubject<boolean | undefined>(this.overrideDisable);

  /** The permission attribute to validate against. */
  @Input() public set permissionAttribute(attribute: PermAttributeName) {
    if (!attribute) return;

    this.attributeName = attribute;
    this.checkPermission$.next();
  }
  /** The permission game title to validate against. */
  @Input() public set permissionTitle(gameTitle: GameTitle) {
    if (!gameTitle) return;

    this.gameTitle = gameTitle;
    this.checkPermission$.next();
  }

  /** The permission game title to validate against. */
  @Input() public set permissionInvalidActionType(actionType: InvalidPermActionType) {
    if (!actionType) return;

    this.actionType = actionType;
    this.checkPermission$.next();
  }

  /** Determines how V1 auth roles are allowed to poss. If false, V1 auth roles will NEVER have permissions. */
  @Input() public set permissionSupportV1Auth(allowV1Auth: boolean) {
    this.allowV1Auth = allowV1Auth;
    this.checkPermission$.next();
  }

  private checkPermission$ = new Subject<void>();
  private attributeName: PermAttributeName;
  private gameTitle: GameTitle;
  private actionType: InvalidPermActionType = InvalidPermActionType.Disable;
  private allowV1Auth: boolean = true;

  constructor(
    private readonly element: ElementRef,
    private readonly permAttributesService: PermAttributesService,
    private readonly viewContainerRef: ViewContainerRef,
    @Optional() private readonly tooltip: MatTooltip,
  ) {
    super();

    const originalCssDisplay = this.element.nativeElement.style.display;

    this.checkPermission$
      .pipe(
        filter(() => !!this.attributeName),
        tap(() => {
          // Default to disabled while waiting for permission initialization guard
          this.updateHostState(true);
        }),
        // Each directive input emits a new event, we need to wait for all inputs to correctly initialize the directive
        debounceTime(HCI.DirectiveInputDebounceMillis),
        switchMap(() => permAttributesService.initializationGuard$),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        const hasPerm = this.permAttributesService.hasFeaturePermission(
          this.attributeName,
          this.gameTitle,
          this.allowV1Auth,
        );

        if (hasPerm) {
          switch (this.actionType) {
            case InvalidPermActionType.Disable:
              this.activateHostElement();
              break;
            case InvalidPermActionType.Hide:
              this.element.nativeElement.style.display = originalCssDisplay;
              break;
          }
        } else {
          switch (this.actionType) {
            case InvalidPermActionType.Disable:
              this.disableHostElement();
              break;
            case InvalidPermActionType.Hide:
              this.element.nativeElement.style.display = 'none';
              break;
          }
        }
      });
  }

  private disableHostElement(): void {
    // Default to disabled permissions while waiting for init guard
    this.updateHostState(true);
    const host = this.element.nativeElement;
    // If host element doesnt have the invalid permissions component as a child, add it
    if (host.firstChild.localName !== 'invalid-permissions') {
      const invalidPermissionComponent = this.viewContainerRef.createComponent(
        InvalidPermissionsComponent,
      );
      invalidPermissionComponent.instance.setPermAttributeName(this.attributeName);
      const host = this.element.nativeElement;
      host.insertBefore(invalidPermissionComponent.location.nativeElement, host.firstChild);
    }
  }

  private activateHostElement(): void {
    // Default to disabled permissions while waiting for init guard
    this.updateHostState(false);
    const host = this.element.nativeElement;

    // If hasPerm is true and host element has the invalid permissions component as a child, remove it
    if (host.firstChild.localName === 'invalid-permissions') {
      host.firstChild.remove();
    }

    if (!!this.tooltip) {
      this.tooltip.disabled = false;
    }
  }

  private updateHostState(disabled: boolean): void {
    this.overrideDisable = disabled;
    this.overrideDisable$.next(this.overrideDisable);
  }
}
