import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { GameTitle } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { FormGroup } from '@angular/forms';
import { WoodstockUserFlags } from '@models/woodstock';
import { SteelheadUserFlags } from '@models/steelhead';
import { SunriseUserFlags } from '@models/sunrise';
import { ApolloUserFlags } from '@models/apollo';
import { PermissionServiceTool, PermissionsService } from '@services/permissions';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

export type UserFlagsUnion =
  | WoodstockUserFlags
  | SteelheadUserFlags
  | SunriseUserFlags
  | ApolloUserFlags;

export type UserFlagsIntersection = WoodstockUserFlags &
  SteelheadUserFlags &
  SunriseUserFlags &
  ApolloUserFlags;

/** Retreives and displays User Flags by XUID. */
@Component({
  template: '',
})
export abstract class UserFlagsBaseComponent<T extends UserFlagsUnion>
  extends BaseComponent
  implements OnChanges
{
  /** The XUID to look up. */
  @Input() public identity: IdentityResultUnion;
  /** Boolean determining if flags can be edited. */
  @Input() public disabled: boolean = false;

  /** True if form control flags do not match current flags. */
  public hasChanges: boolean = false;
  w;
  /** The flags currently applied to the user. */
  public currentFlags: T;
  /** True when the "I have verified this" checkbox is ticked. Reset on model change. */
  public verified = false;
  /** True while waiting to submit. */
  public isSubmitting: boolean;

  public getFlagsActionMonitor = new ActionMonitor('Get user flags');
  public setFlagsActionMonitor = new ActionMonitor('Set user flags');

  /** Alternate text per key. */
  public readonly alteredLabels: { [key in keyof UserFlagsIntersection]?: string } = {
    isEarlyAccess: 'Is Early Access (Unbannable)',
    isTurn10Employee: 'Is Employee (User Badge + Unbannable)',
    isUnderReview: 'Is Under Review (Console Banned)',
    isContentCreator: 'Is Content Creator (Unbannable)',
  };

  public abstract gameTitle: GameTitle;
  public abstract formControls: unknown;
  public abstract formGroup: FormGroup;

  constructor(private readonly permissionsService: PermissionsService) {
    super();
  }

  public abstract getFlagsByXuid$(xuid: BigNumber): Observable<T>;
  public abstract putFlagsByXuid$(xuid: BigNumber): Observable<T>;

  /** Lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    // Ignore permission service if disabled input is set to true
    this.disabled =
      this.disabled ||
      !this.permissionsService.currentUserHasWritePermission(PermissionServiceTool.SetUserFlags);

    if (this.disabled) {
      this.formGroup?.disable();
    }

    if (!this.identity?.xuid) {
      return;
    }

    this.getFlagsActionMonitor = this.getFlagsActionMonitor.repeat();
    const getFlagsByXuid$ = this.getFlagsByXuid$(this.identity.xuid);
    getFlagsByXuid$
      .pipe(
        take(1),
        this.getFlagsActionMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      )
      .subscribe(flags => {
        this.currentFlags = flags;
        this.setFlagsToCurrent();
      });
  }

  /** Submits the changes. */
  public applyFlags(): void {
    this.setFlagsActionMonitor = this.setFlagsActionMonitor.repeat();
    this.putFlagsByXuid$(this.identity.xuid)
      .pipe(
        take(1),
        tap(value => {
          this.currentFlags = value;
          this.setFlagsToCurrent();
        }),
        this.setFlagsActionMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  /** Resets the flag visuals. */
  public setFlagsToCurrent(): void {
    this.hasChanges = false;
    for (const flag in this.currentFlags) {
      const key = flag.toString();
      this.formControls[key]?.setValue(this.currentFlags[key]);
    }

    this.formGroup.markAsPristine();
  }

  /**
   * Changing mat checkbox sets dirty status.
   * This function verifies that status and sets form to pristine if it is not true.
   */
  public verifyDirtyStatus(): void {
    let isPristine = true;
    for (const flag in this.currentFlags) {
      if (!isPristine) break;
      const key = flag.toString();
      isPristine = this.formControls[key].value === this.currentFlags[key];
    }

    if (isPristine) {
      this.formGroup.markAsPristine();
    }
  }

  /** NgFor keyvalue sort function to keep order as properties are setup in model. */
  public keepOrder = (a: never, _b: never): never => {
    return a;
  };
}
