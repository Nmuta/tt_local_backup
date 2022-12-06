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
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import {
  DisableStateProvider,
  STEWARD_DISABLE_STATE_PROVIDER,
} from '@shared/modules/state-managers/injection-tokens';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { InvalidPermissionsComponent } from '../components/invalid-permissions/invalid-permissions.component';

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

  /** Test */
  @Input() public set permissionAttribute(attribute: PermAttributeName) {
    if (!attribute) return;

    this.attributeName = attribute;
    this.checkPermission$.next(null);
  }
  /** Test */
  @Input() public set permissionTitle(gameTitle: GameTitle) {
    if (!gameTitle) return;

    this.gameTitle = gameTitle;
    this.checkPermission$.next(null);
  }

  private checkPermission$ = new Subject();
  private attributeName: PermAttributeName;
  private gameTitle: GameTitle;

  constructor(
    element: ElementRef,
    permAttributesService: PermAttributesService,
    viewContainerRef: ViewContainerRef,
    @Optional() tooltip: MatTooltip,
  ) {
    super();

    this.checkPermission$
      .pipe(
        filter(() => !!this.attributeName),
        tap(() => {
          // Default to disabled permissions while waiting for init guard
          this.updateHostState(true);
          const host = element.nativeElement;
          // If host element doesnt have the invalid permissions component as a child, add it
          if (host.firstChild.localName !== 'invalid-permissions') {
            const invalidPermissionComponent = viewContainerRef.createComponent(
              InvalidPermissionsComponent,
            );
            invalidPermissionComponent.instance.setPermAttributeName(this.attributeName);
            const host = element.nativeElement;
            host.insertBefore(invalidPermissionComponent.location.nativeElement, host.firstChild);
          }
        }),
        switchMap(() => permAttributesService.initializationGuard$),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        const hasPerm = permAttributesService.hasFeaturePermission(
          this.attributeName,
          this.gameTitle,
        );

        this.updateHostState(!hasPerm);

        const host = element.nativeElement;
        // If hasPerm is true and host element has the invalid permissions component as a child, remove it
        if (hasPerm && host.firstChild.localName === 'invalid-permissions') {
          host.firstChild.remove();
        }

        if (!!tooltip) {
          tooltip.disabled = !hasPerm;
        }
      });
  }

  private updateHostState(disabled: boolean): void {
    this.overrideDisable = disabled;
    this.overrideDisable$.next(this.overrideDisable);
  }
}
