import { Directive, ElementRef, forwardRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { BaseDirective } from '@components/base-component/base.directive';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { DisableStateProvider, STEWARD_DISABLE_STATE_PROVIDER } from '@shared/modules/state-managers/injection-tokens';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { InvalidPermissionsComponent } from '../components/invalid-permissions/invalid-permissions.component';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `button[mat-button][permissionAttribute], button[mat-raised-button][permissionAttribute], button[mat-icon-button][permissionAttribute],
  button[mat-fab][permissionAttribute], button[mat-mini-fab][permissionAttribute], button[mat-stroked-button][permissionAttribute],
  button[mat-flat-button][permissionAttribute]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => PermissionAttributeButtonDirective),
      multi: true,
    },
  ],
})
export class PermissionAttributeButtonDirective extends BaseDirective implements DisableStateProvider {
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
  private readonly invalidPermsMessage = 'You do not have the permissions to use this feature';

  constructor(
    element: ElementRef, 
    renderer: Renderer2,
    permAttributesService: PermAttributesService,  
    viewContainerRef: ViewContainerRef) {
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
          const invalidPermissionComponent = viewContainerRef.createComponent(InvalidPermissionsComponent);
          const host = element.nativeElement;
          host.insertBefore(invalidPermissionComponent.location.nativeElement, host.firstChild)
        }
      });
  }

  private updateHostState(disabled: boolean): void {
    this.overrideDisable = disabled;
    this.overrideDisable$.next(this.overrideDisable);
  }
}
