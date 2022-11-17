import { Directive, forwardRef, Input, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BaseDirective } from '@components/base-component/base.directive';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { STEWARD_DISABLE_STATE_PROVIDER } from '@shared/modules/state-managers/injection-tokens';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

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
export class PermissionAttributeButtonDirective extends BaseDirective {
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

  constructor(host: MatButton, renderer: Renderer2, permAttributesService: PermAttributesService) {
    super();

    this.checkPermission$
      .pipe(
        switchMap(() => permAttributesService.initializationGuard$),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        // console.log(this.attributeName)
        // console.log(this.gameTitle)
        const hasPerm = permAttributesService.hasFeaturePermission(
          this.attributeName,
          this.gameTitle,
        );

        host.disabled = !hasPerm;
        if (host.disabled) {
          // TODO: What do we want to do here?
        }
      });
  }
}
