import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { mergedParamMap$ } from '@helpers/param-map';
import { GameTitle } from '@models/enums';
import { SteelheadPlayerUgcItem, SteelheadGeoFlags } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { SteelheadUgcSharecodeService } from '@services/api-v2/steelhead/ugc/sharecode/steelhead-ugc-sharecode.service';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import { SteelheadUgcReportService } from '@services/api-v2/steelhead/ugc/report/steelhead-ugc-report.service';
import { OldPermissionServiceTool, OldPermissionsService } from '@services/old-permissions';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { chain, cloneDeep, first, keys } from 'lodash';
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
  EMPTY,
  throwError,
} from 'rxjs';
import { ToggleListEzContract } from '@shared/modules/standard-form/toggle-list-ez/toggle-list-ez.component';
import { generateLookupRecord as toCompleteRecord } from '@helpers/generate-lookup-record';
import { ToggleListOptions } from '@shared/modules/standard-form/toggle-list/toggle-list.component';
import { SteelheadUgcGeoFlagsService } from '@services/api-v2/steelhead/ugc/geo-flags/steelhead-ugc-geo-flags.service';
import { SteelheadEditUgcModalComponent } from '@views/edit-ugc-modal/steelhead/steelhead-edit-ugc-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SteelheadFeatureUgcModalComponent } from '@views/feature-ugc-modal/steelhead/steelhead-feature-ugc-modal.component';
import { SteelheadUgcHideStatusService } from '@services/api-v2/steelhead/ugc/hide-status/steelhead-ugc-hide-status.service';
import { UgcReportReason } from '@models/ugc-report-reason';

const GEO_FLAGS_ORDER = chain(SteelheadGeoFlags).sortBy().value();

/** Routed component that displays details about a steelhead UGC item. */
@Component({
  templateUrl: './steelhead-lookup.component.html',
  styleUrls: ['./steelhead-lookup.component.scss'],
})
export class SteelheadLookupComponent extends BaseComponent implements OnInit {
  public ugcItem: SteelheadPlayerUgcItem;
  public getMonitor = new ActionMonitor('GET UGC Monitor');
  public hideMonitor = new ActionMonitor('Post Hide UGC');
  public unhideMonitor = new ActionMonitor('POST Unhide UGC');
  public reportMonitor = new ActionMonitor('Post Report UGC');
  public generateSharecodeMonitor = new ActionMonitor('POST Generate Sharecode for UGC');
  public getReportReasonsMonitor: ActionMonitor = new ActionMonitor('GET Report Reasons');

  public geoFlagsToggleListEzContract: ToggleListEzContract = {
    initialModel: toCompleteRecord(GEO_FLAGS_ORDER, []),
    order: GEO_FLAGS_ORDER,
    title: 'Geo Flags',
    gameTitle: GameTitle.FM8,
    permAttribute: PermAttributeName.SetUgcGeoFlag,
    submitModel$: () => EMPTY,
  };
  public reportReasons: UgcReportReason[] = null;
  public selectedReason: string = null;
  public userHasWritePerms: boolean = false;
  public canFeatureUgc: boolean = false;
  public canGenerateSharecode: boolean = false;
  public canReportUgc: boolean = true;
  public canHideUgc: boolean = true;
  public featureMatTooltip: string = null;
  public generateSharecodeMatTooltip: string = null;
  private readonly privateUgcTooltip = 'Cannot feature private UGC content';
  private readonly incorrectPermsTooltip = 'This action is restricted for your user role';
  private readonly privateUgcSharecodeTooltip = 'Cannot generate Sharecode for private UGC';
  private readonly replayUgcSharecodeTooltip = 'Cannot generate Sharecode for a Replay UGC item';
  private readonly existingSharecodeTooltip = 'Sharecode already exists for UGC';
  private readonly generateSharecodeTooltip = '"Generate sharecode for UGC"';

  public featurePermAttribute = PermAttributeName.FeatureUgc;
  public reportPermAttribute = PermAttributeName.ReportUgc;
  public hidePermAttribute = PermAttributeName.HideUgc;
  public unhidePermAttribute = PermAttributeName.UnhideUgc;
  public editPermAttribute = PermAttributeName.EditUgc;
  public gameTitle = GameTitle.FM8;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ugcLookupService: SteelheadUgcLookupService,
    private readonly permissionsService: OldPermissionsService,
    private readonly ugcReportService: SteelheadUgcReportService,
    private readonly ugcSharecodeService: SteelheadUgcSharecodeService,
    private readonly ugcHideStatusService: SteelheadUgcHideStatusService,
    private readonly ugcGeoFlagsService: SteelheadUgcGeoFlagsService,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.userHasWritePerms = this.permissionsService.currentUserHasWritePermission(
      OldPermissionServiceTool.FeatureUgc,
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
            this.ugcLookupService
              .getUgcBySharecode$(params.id, params.type)
              .pipe(catchError(() => of(null))),
            this.ugcLookupService
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
            return this.ugcGeoFlagsService.setUgcGeoFlag$(this.ugcItem.id, trueKeys);
          };
          this.geoFlagsToggleListEzContract = newGeoFlagsContract;
        } else {
          const newGeoFlagsContract = cloneDeep(this.geoFlagsToggleListEzContract);
          newGeoFlagsContract.error = 'Could not read geo-flags';
          newGeoFlagsContract.submitModel$ = () => EMPTY;
          this.geoFlagsToggleListEzContract = newGeoFlagsContract;
        }

        this.canFeatureUgc = this.ugcItem?.isPublic && this.userHasWritePerms;
        this.canGenerateSharecode = !this.ugcItem?.shareCode && !this.isReplayUgcItem();

        if (!this.userHasWritePerms) {
          this.featureMatTooltip = this.incorrectPermsTooltip;
        } else if (!this.ugcItem?.isPublic) {
          this.featureMatTooltip = this.privateUgcTooltip;
        }

        if (!this.canGenerateSharecode) {
          if (this.ugcItem?.shareCode) {
            this.generateSharecodeMatTooltip = this.existingSharecodeTooltip;
          } else if (!this.ugcItem?.isPublic) {
            this.generateSharecodeMatTooltip = this.privateUgcSharecodeTooltip;
          } else if (this.isReplayUgcItem()) {
            this.generateSharecodeMatTooltip = this.replayUgcSharecodeTooltip;
          }
        } else {
          this.generateSharecodeMatTooltip = this.generateSharecodeTooltip;
        }

        this.canReportUgc = !this.isReplayUgcItem();
        this.canHideUgc = !this.isReplayUgcItem();
      });

    this.ugcReportService
      .getUgcReportReasons$()
      .pipe(this.getReportReasonsMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(results => {
        this.reportReasons = results;
      });
  }

  /** Features a UGC item in Steelhead */
  public featureUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }

    this.dialog
      .open(SteelheadFeatureUgcModalComponent, {
        data: this.ugcItem,
      })
      .afterClosed()
      .pipe(
        filter(data => !!data),
        takeUntil(this.onDestroy$),
      )
      .subscribe((response: SteelheadPlayerUgcItem) => {
        this.ugcItem = response;
      });
  }

  /** Edits a UGC item in Woodstock */
  public editUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }

    this.dialog
      .open(SteelheadEditUgcModalComponent, {
        data: this.ugcItem,
      })
      .afterClosed()
      .pipe(
        filter(data => !!data),
        takeUntil(this.onDestroy$),
      )
      .subscribe((response: SteelheadPlayerUgcItem) => {
        this.ugcItem = response;
      });
  }

  /** Hide a UGC item in Steelhead */
  public hideUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }
    this.hideMonitor = this.hideMonitor.repeat();

    this.ugcHideStatusService
      .hideUgcItems$([this.ugcItem.id])
      .pipe(this.hideMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.canFeatureUgc = false;
        this.ugcItem.isHidden = true;
        this.ugcItem.isPublic = false;
      });
  }

  /** Unhide a UGC item in Woodstock */
  public unhideUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }
    this.unhideMonitor = this.unhideMonitor.repeat();

    this.ugcHideStatusService
      .unhideUgcItems$([this.ugcItem.id])
      .pipe(this.unhideMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.canFeatureUgc = true;
        this.ugcItem.isHidden = false;
        this.ugcItem.isPublic = true;
      });
  }

  /** Updates the geoflags contract after submit. */
  public updateGeoFlagsModel(geoFlags: ToggleListOptions): void {
    const newGeoFlagsContract = cloneDeep(this.geoFlagsToggleListEzContract);
    newGeoFlagsContract.initialModel = geoFlags;
    this.geoFlagsToggleListEzContract = newGeoFlagsContract;
  }

  /** Report a Ugc item in Steelhead */
  public reportUgcItem(): void {
    if (!this.ugcItem || !this.selectedReason) {
      return;
    }
    this.reportMonitor = this.reportMonitor.repeat();

    this.ugcReportService
      .reportUgc$([this.ugcItem.id], this.selectedReason)
      .pipe(
        switchMap(results => {
          const item = results[0];

          if (item.error) {
            return throwError(() => item.error);
          }

          return of(results);
        }),
        this.reportMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.selectedReason = null;
      });
  }

  /** Generate sharecode for a UGC item in Steelhead */
  public generateSharecodeForUgc(): void {
    if (!this.ugcItem) {
      return;
    }

    this.generateSharecodeMonitor = this.generateSharecodeMonitor.repeat();

    this.ugcSharecodeService
      .ugcGenerateSharecode$(this.ugcItem.id)
      .pipe(this.generateSharecodeMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(newSharecode => {
        this.ugcItem.shareCode = newSharecode.sharecode;
        this.ugcItem = cloneDeep(this.ugcItem);
        this.canGenerateSharecode = false;
      });
  }

  private isReplayUgcItem(): boolean {
    return this.ugcItem?.type === UgcType.Replay;
  }
}
