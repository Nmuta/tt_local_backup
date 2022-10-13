import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { mergedParamMap$ } from '@helpers/param-map';
import { generateLookupRecord as toCompleteRecord } from '@helpers/generate-lookup-record';
import { WoodstockGeoFlags, WoodstockPlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { UgcReportReason } from '@models/ugc-report-reason';
import { WoodstockUgcReportService } from '@services/api-v2/woodstock/ugc/woodstock-ugc-report.service';
import { PermissionServiceTool, PermissionsService } from '@services/permissions';
import { WoodstockService } from '@services/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { ToggleListEzContract } from '@shared/modules/standard-form/toggle-list-ez/toggle-list-ez.component';
import { ToggleListOptions } from '@shared/modules/standard-form/toggle-list/toggle-list.component';
import { WoodstockFeatureUgcModalComponent } from '@views/feature-ugc-modal/woodstock/woodstock-feature-ugc-modal.component';
import { chain, cloneDeep, first, keys } from 'lodash';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  map,
  of,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

const GEO_FLAGS_ORDER = chain(WoodstockGeoFlags).sortBy().value();

/** Routed component that displays details about a woodstock UGC item. */
@Component({
  templateUrl: './woodstock-lookup.component.html',
  styleUrls: ['./woodstock-lookup.component.scss'],
})
export class WoodstockLookupComponent extends BaseComponent implements OnInit {
  public ugcItem: WoodstockPlayerUgcItem;
  public getMonitor = new ActionMonitor('GET UGC Monitor');
  public hideMonitor = new ActionMonitor('Post Hide UGC');
  public reportMonitor = new ActionMonitor('Post Report UGC');
  public getReportReasonsMonitor: ActionMonitor = new ActionMonitor('GET Report Reasons');

  public userHasWritePerms: boolean = false;
  public canChangeGeoFlags: boolean = false;
  public canFeatureUgc: boolean = false;
  public canHideUgc: boolean = false;
  public featureMatToolip: string = null;
  public geoFlagsToggleListEzContract: ToggleListEzContract = {
    initialModel: toCompleteRecord(GEO_FLAGS_ORDER, []),
    order: GEO_FLAGS_ORDER,
    title: 'Geo Flags',
    submitModel$: () => EMPTY,
  };
  public reportReasons: UgcReportReason[] = null;
  public selectedReason: string = null;
  private readonly privateUgcTooltip = 'Cannot feature private UGC content';
  private readonly incorrectPermsTooltip = 'This action is restricted for your user role';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: WoodstockService,
    private readonly permissionsService: PermissionsService,
    private readonly ugcReportService: WoodstockUgcReportService,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.userHasWritePerms = this.permissionsService.currentUserHasWritePermission(
      PermissionServiceTool.FeatureUgc,
    );

    this.canChangeGeoFlags = !this.permissionsService.currentUserHasWritePermission(
      PermissionServiceTool.SetUgcGeoFlags,
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
      )
      .pipe(
        this.getMonitor.monitorCatch(),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(([shareCodeItems, idItem]) => {
        this.ugcItem = idItem ?? first(shareCodeItems);

        if (!!this.ugcItem?.geoFlags) {
          const newGeoFlagsContract = cloneDeep(this.geoFlagsToggleListEzContract);
          newGeoFlagsContract.initialModel = toCompleteRecord(
            GEO_FLAGS_ORDER,
            this.ugcItem.geoFlags ?? [],
          );
          newGeoFlagsContract.submitModel$ = model => {
            const trueKeys = chain(model)
              .toPairs()
              .filter(([_k, v]) => !!v)
              .map(([k, _v]) => k)
              .value();
            return this.service.setUgcGeoFlag$(this.ugcItem.id, trueKeys);
          };
          this.geoFlagsToggleListEzContract = newGeoFlagsContract;
        } else {
          const newGeoFlagsContract = cloneDeep(this.geoFlagsToggleListEzContract);
          newGeoFlagsContract.error = 'Could not read geo-flags';
          newGeoFlagsContract.submitModel$ = () => EMPTY;
          this.geoFlagsToggleListEzContract = newGeoFlagsContract;
        }

        this.canFeatureUgc = this.ugcItem?.isPublic && this.userHasWritePerms;
        this.canHideUgc = this.ugcItem?.isPublic;

        if (!this.userHasWritePerms) {
          this.featureMatToolip = this.incorrectPermsTooltip;
        } else if (!this.ugcItem?.isPublic) {
          this.featureMatToolip = this.privateUgcTooltip;
        }
      });

    this.ugcReportService
      .getUgcReportReasons$()
      .pipe(this.getReportReasonsMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(results => {
        this.reportReasons = results;
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
      .subscribe((response: WoodstockPlayerUgcItem) => {
        this.ugcItem = response;
      });
  }

  /** Hide a UGC item in Woodstock */
  public hideUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }
    this.hideMonitor = this.hideMonitor.repeat();

    this.service
      .hideUgc$(this.ugcItem.id)
      .pipe(this.hideMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.canFeatureUgc = false;
        this.canHideUgc = false;
      });
  }

  /** Updates the geoflags contract after submit. */
  public updateGeoFlagsModel(geoFlags: ToggleListOptions): void {
    const newGeoFlagsContract = cloneDeep(this.geoFlagsToggleListEzContract);
    newGeoFlagsContract.initialModel = geoFlags;
    this.geoFlagsToggleListEzContract = newGeoFlagsContract;
  }

  /** Report a Ugc item in Woodstock */
  public reportUgcItem(): void {
    if (!this.ugcItem || !this.selectedReason) {
      return;
    }
    this.reportMonitor = this.reportMonitor.repeat();

    this.ugcReportService
      .reportUgc$(this.ugcItem.id, this.selectedReason)
      .pipe(this.reportMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.selectedReason = null;
      });
  }
}
