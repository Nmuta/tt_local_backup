import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { mergedParamMap$ } from '@helpers/param-map';
import { GameTitle } from '@models/enums';
import { SteelheadPlayerUgcItem, WoodstockGeoFlags } from '@models/player-ugc-item';
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
} from 'rxjs';
import { ToggleListEzContract } from '@shared/modules/standard-form/toggle-list-ez/toggle-list-ez.component';
import { generateLookupRecord as toCompleteRecord } from '@helpers/generate-lookup-record';
import { ToggleListOptions } from '@shared/modules/standard-form/toggle-list/toggle-list.component';
import { SteelheadUgcGeoFlagsService } from '@services/api-v2/steelhead/ugc/geo-flags/steelhead-ugc-geo-flags.service';

const GEO_FLAGS_ORDER = chain(WoodstockGeoFlags).sortBy().value();

/** Routed component that displays details about a steelhead UGC item. */
@Component({
  templateUrl: './steelhead-lookup.component.html',
  styleUrls: ['./steelhead-lookup.component.scss'],
})
export class SteelheadLookupComponent extends BaseComponent implements OnInit {
  public ugcItem: SteelheadPlayerUgcItem;
  public getMonitor = new ActionMonitor('GET UGC Monitor');
  public hideMonitor = new ActionMonitor('Post Hide UGC');
  public reportMonitor = new ActionMonitor('Post Report UGC');
  public generateSharecodeMonitor = new ActionMonitor('POST Generate Sharecode for UGC');

  public geoFlagsToggleListEzContract: ToggleListEzContract = {
    initialModel: toCompleteRecord(GEO_FLAGS_ORDER, []),
    order: GEO_FLAGS_ORDER,
    title: 'Geo Flags',
    gameTitle: GameTitle.FM8,
    permAttribute: PermAttributeName.SetUgcGeoFlag,
    submitModel$: () => EMPTY,
  };
  public userHasWritePerms: boolean = false;
  public canFeatureUgc: boolean = false;
  public canHideUgc: boolean = false;
  public canGenerateSharecode: boolean = false;
  public featureMatTooltip: string = null;
  public generateSharecodeMatTooltip: string = null;
  private readonly privateUgcTooltip = 'Cannot feature private UGC content';
  private readonly incorrectPermsTooltip = 'This action is restricted for your user role';
  private readonly privateUgcSharecodeTooltip = 'Cannot generate Sharecode for private UGC';
  private readonly existingSharecodeTooltip = 'Sharecode already exists for UGC';
  private readonly generateSharecodeTooltip = '"Generate sharecode for UGC"';

  public featurePermAttribute = PermAttributeName.FeatureUgc;
  public reportPermAttribute = PermAttributeName.ReportUgc;
  public hidePermAttribute = PermAttributeName.HideUgc;
  public gameTitle = GameTitle.FM8;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ugcLookupService: SteelheadUgcLookupService,
    private readonly permissionsService: OldPermissionsService,
    private readonly ugcReportService: SteelheadUgcReportService,
    private readonly ugcSharecodeService: SteelheadUgcSharecodeService,
    private readonly ugcGeoFlagsService: SteelheadUgcGeoFlagsService,
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

        this.canFeatureUgc = this.canFeatureUgc && this.ugcItem?.isPublic && this.userHasWritePerms;
        this.canGenerateSharecode = !this.ugcItem?.shareCode;

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
          }
        } else {
          this.generateSharecodeMatTooltip = this.generateSharecodeTooltip;
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

    throw new Error(`Steelhead does not support hiding UGC.`);
  }

  /** Updates the geoflags contract after submit. */
  public updateGeoFlagsModel(geoFlags: ToggleListOptions): void {
    const newGeoFlagsContract = cloneDeep(this.geoFlagsToggleListEzContract);
    newGeoFlagsContract.initialModel = geoFlags;
    this.geoFlagsToggleListEzContract = newGeoFlagsContract;
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

  /** Generate sharecode for a UGC item in Woodstock */
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
}
