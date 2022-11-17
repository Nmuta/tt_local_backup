import { Directive, forwardRef, HostBinding, Input, Optional } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { BaseDirective } from '@components/base-component/base.directive';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { STEWARD_DISABLE_STATE_PROVIDER } from '@shared/modules/state-managers/injection-tokens';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

/** A directive that toggles the enabled state of the host button with the provided mat-checkbox. */
@Directive({
  selector: `mat-checkbox[permissionAttribute]`,
  providers: [
    {
      provide: STEWARD_DISABLE_STATE_PROVIDER,
      useExisting: forwardRef(() => PermissionAttributeCheckboxDirective),
      multi: true,
    },
  ],
})
export class PermissionAttributeCheckboxDirective extends BaseDirective {
  @HostBinding('attr.matTooltip') matTooltip;
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
    host: MatCheckbox,
    permAttributesService: PermAttributesService,
    @Optional() tooltip: MatTooltip,
  ) {
    super();

    if (!tooltip) {
      throw new Error(
        'Mat Tooltip missing from checkbox. Any element using a permission directive requires a matTooltip.',
      );
    }

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

        host.disabled = !hasPerm;
        if (host.disabled) {
          if (!!tooltip) {
            tooltip.message = this.invalidPermsMessage;
          }
        }
      });

    // permAttributesService.initializationGuard$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
    //   console.log(this.permissionAttribute);
    //   console.log(this.permissionTitle);

    //   const hasPerm = permAttributesService.hasFeaturePermission(
    //     this.permissionAttribute,
    //     this.permissionTitle,
    //   );

    //   host.disabled = !hasPerm;
    //   console.log(host)
    //   if(host.disabled) {
    //     this.matTooltip = 'Bloah blah ablha';
    //   }
    // });
  }
}
