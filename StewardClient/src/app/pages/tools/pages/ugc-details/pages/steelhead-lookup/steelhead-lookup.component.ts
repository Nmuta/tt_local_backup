import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { mergedParamMap$ } from '@helpers/param-map';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import { SteelheadUgcReportService } from '@services/api-v2/steelhead/ugc/report/steelhead-ugc-report.service';
import { PermissionServiceTool, OldPermissionsService } from '@services/old-permissions';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { first, keys } from 'lodash';
import {
  map,
  startWith,
  pairwise,
  filter,
  switchMap,
  combineLatest,
  catchError,
  of,
  takeUntil,
} from 'rxjs';

/** Routed component that displays details about a steelhead UGC item. */
@Component({
  templateUrl: './steelhead-lookup.component.html',
  styleUrls: ['./steelhead-lookup.component.scss'],
})
export class SteelheadLookupComponent extends BaseComponent implements OnInit {
  public ugcItem: PlayerUgcItem;
  public getMonitor = new ActionMonitor('GET UGC Monitor');
  public hideMonitor = new ActionMonitor('Post Hide UGC');
  public reportMonitor = new ActionMonitor('Post Report UGC');

  public userHasWritePerms: boolean = false;
  public canFeatureUgc: boolean = false;
  public canHideUgc: boolean = false;
  public featureMatToolip: string = null;
  private readonly privateUgcTooltip = 'Cannot feature private UGC content';
  private readonly incorrectPermsTooltip = 'This action is restricted for your user role';

  public permAttribute = PermAttributeName.FeatureUgc;
  public gameTitle = GameTitle.FM8;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly steelheadUgcLookupService: SteelheadUgcLookupService,
    private readonly permissionsService: OldPermissionsService,
    private readonly ugcReportService: SteelheadUgcReportService,
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
            this.steelheadUgcLookupService
              .getUgcBySharecode$(params.id, params.type)
              .pipe(catchError(() => of(null))),
            this.steelheadUgcLookupService
              .getPlayerUgcItem$(params.id, params.type)
              .pipe(catchError(() => of(null))),
          ]),
        ),
        this.getMonitor.monitorCatch(),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(([shareCodeItems, idItem]) => {
        this.ugcItem = idItem ?? first(shareCodeItems);
        this.canFeatureUgc = this.canFeatureUgc && this.ugcItem?.isPublic && this.userHasWritePerms;

        if (!this.userHasWritePerms) {
          this.featureMatToolip = this.incorrectPermsTooltip;
        } else if (!this.ugcItem?.isPublic) {
          this.featureMatToolip = this.privateUgcTooltip;
        }
      });
  }

  /** Features a UGC item in Steelhead */
  public featureUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }

    throw new Error(`Steelhead does not support featuring UGC.`);
  }

  /** Hide a UGC item in Steelhead */
  public hideUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }

    throw new Error(`Steelhead does not support featuring UGC.`);
  }

  /** Report a Ugc item in Woodstock */
  public reportUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }
    this.reportMonitor = this.reportMonitor.repeat();

    this.ugcReportService
      .reportUgc$(this.ugcItem.id)
      .pipe(this.reportMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe();
  }
}
