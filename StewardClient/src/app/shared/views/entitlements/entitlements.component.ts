import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Entitlement, EntitlementType } from '@models/entitlement';
import { IdentityResultUnion } from '@models/identity-query.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { KustoService } from '@services/kusto';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';

/**
 *  Player entitlements component.
 */
@Component({
  selector: 'entitlements',
  templateUrl: './entitlements.component.html',
  styleUrls: ['./entitlements.component.scss'],
})
export class EntitlementsComponent extends BaseComponent implements OnChanges {
  @Input() defaultFilter: string;
  @Input() identity: IdentityResultUnion;

  public getEntitlements$ = new Subject();
  public entitlementsTable = new BetterMatTableDataSource<Entitlement>();
  public displayedColumns: string[] = ['entitlement', 'metadata', 'flags'];

  public getMonitor = new ActionMonitor('Get player entitlements');
  public entitlementType = EntitlementType;

  constructor(kustoService: KustoService) {
    super();

    this.getEntitlements$
      .pipe(
        tap(() => {
          this.entitlementsTable.data = [];
          this.getMonitor;
        }),
        switchMap(() => {
          if (!this.identity?.xuid) {
            return of([]);
          }

          this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
          return kustoService
            .getKustoPlayerEntitlements$(this.identity?.xuid)
            .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$));
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(entitlements => {
        this.entitlementsTable.data = entitlements;
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    this.getEntitlements$.next();
  }
}
