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
import { switchMap, takeUntil } from 'rxjs/operators';
import { InvalidPermissionsComponent } from '../components/invalid-permissions/invalid-permissions.component';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `mat-checkbox[stateManager][permissionAttribute] button[mat-button][stateManager][permissionAttribute], button[mat-raised-button][stateManager][permissionAttribute], button[mat-icon-button][stateManager][permissionAttribute],
  button[mat-fab][stateManager][permissionAttribute], button[mat-mini-fab][stateManager][permissionAttribute], button[mat-stroked-button][stateManager][permissionAttribute],
  button[mat-flat-button][stateManager][permissionAttribute]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => PermissionAttributeDirective),
      multi: true,
    },
  ],
})
export class PermissionAttributeDirective
  extends BaseDirective
  implements DisableStateProvider
{
  public overrideDisable: boolean = undefined;
  public overrideDisable$ = new BehaviorSubject<boolean | undefined>(this.overrideDisable);

  /** Test */
  @Input() public set permissionAttribute(attribute: PermAttributeName) {
    this.attributeName = attribute;
    this.checkPermission$.next(null);
  }
  /** Test */
  @Input() public set permissionTitle(gametitle: GameTitle) {
    this.gameTitle = gametitle;
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
        if (!hasPerm && host.firstChild.localName !== 'invalid-permissions') {
          const invalidPermissionComponent = viewContainerRef.createComponent(
            InvalidPermissionsComponent,
          );
          const host = element.nativeElement;
          host.insertBefore(invalidPermissionComponent.location.nativeElement, host.firstChild);
        }

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
