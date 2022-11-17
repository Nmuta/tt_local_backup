import { Directive, forwardRef, Input, Optional } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { BaseDirective } from '@components/base-component/base.directive';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { DisableStateProvider, STEWARD_DISABLE_STATE_PROVIDER } from '@shared/modules/state-managers/injection-tokens';
import { BehaviorSubject, Subject } from 'rxjs';
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
export class PermissionAttributeCheckboxDirective extends BaseDirective implements DisableStateProvider {
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

        this.updateHostState(!hasPerm);
        
        if (!hasPerm) {
          if (!!tooltip) {
            tooltip.message = this.invalidPermsMessage;
          }
        }
      });
  }

  private updateHostState(disabled: boolean): void {
    this.overrideDisable = disabled;
    this.overrideDisable$.next(this.overrideDisable);
  }
}
