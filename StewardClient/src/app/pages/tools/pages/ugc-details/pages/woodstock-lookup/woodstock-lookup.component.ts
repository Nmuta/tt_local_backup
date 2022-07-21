import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { mergedParamMap$ } from '@helpers/param-map';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { PermissionServiceTool, PermissionsService } from '@services/permissions';
import { WoodstockService } from '@services/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { WoodstockFeatureUgcModalComponent } from '@views/feature-ugc-modal/woodstock/woodstock-feature-ugc-modal.component';
import { first, keys } from 'lodash';
import {
  catchError,
  combineLatest,
  filter,
  map,
  of,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

/** Routed component that displays details about a woodstock UGC item. */
@Component({
  templateUrl: './woodstock-lookup.component.html',
  styleUrls: ['./woodstock-lookup.component.scss'],
})
export class WoodstockLookupComponent extends BaseComponent implements OnInit {
  public ugcItem: PlayerUgcItem;
  public getMonitor = new ActionMonitor('GET UGC Monitor');

  public userHasWritePerms: boolean = false;
  public canFeatureUgc: boolean = false;
  public featureMatToolip: string = null;
  private readonly privateUgcTooltip = 'Cannot feature private UGC content';
  private readonly incorrectPermsTooltip = 'This action is restricted for your user role';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: WoodstockService,
    private readonly permissionsService: PermissionsService,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.userHasWritePerms = this.permissionsService.currentUserHasWritePermission(
      PermissionServiceTool.FeatureUgc,
    );

    mergedParamMap$(this.route)
      ?.pipe(
        this.getMonitor.monitorStart(),
        map(params => {
          const type = params.type;
          const convertedType = first(keys(UgcType).filter(t => type === t.toLowerCase()));
          return {
            id: params.id,
            type: convertedType as UgcType,
          };
        }),
        startWith(null),
        pairwise(),
        filter(([prev, cur]) => {
          return prev !== cur;
        }),
        map(([_prev, cur]) => cur),
        switchMap(params =>
          combineLatest([
            this.service
              .getPlayerUgcByShareCode$(params.id, params.type)
              .pipe(catchError(() => of(null))),
            this.service.getPlayerUgcItem$(params.id, params.type).pipe(catchError(() => of(null))),
          ]),
        ),
        this.getMonitor.monitorCatch(),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(([shareCodeItems, idItem]) => {
        this.ugcItem = idItem ?? first(shareCodeItems);
        this.canFeatureUgc = this.ugcItem?.isPublic && this.userHasWritePerms;

        if (!this.userHasWritePerms) {
          this.featureMatToolip = this.incorrectPermsTooltip;
        } else if (!this.ugcItem?.isPublic) {
          this.featureMatToolip = this.privateUgcTooltip;
        }
      });
  }

  /** Features a UGC item in Woodstock */
  public featureUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }

    this.dialog
      .open(WoodstockFeatureUgcModalComponent, {
        data: this.ugcItem,
      })
      .afterClosed()
      .pipe(
        filter(data => !!data),
        takeUntil(this.onDestroy$),
      )
      .subscribe((response: PlayerUgcItem) => {
        this.ugcItem = response;
      });
  }
}
