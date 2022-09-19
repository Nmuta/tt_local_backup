import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { mergedParamMap$ } from '@helpers/param-map';
import { toCompleteLookup as toCompleteRecord } from '@helpers/to-complete-record';
import { PlayerUgcItem, WoodstockGeoFlags, WoodstockPlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
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
  empty,
  filter,
  map,
  Observable,
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

  public userHasWritePerms: boolean = false;
  public canFeatureUgc: boolean = false;
  public canHideUgc: boolean = false;
  public featureMatToolip: string = null;
  public geoFlagsToggleListEzContract: ToggleListEzContract = {
    initialModel: toCompleteRecord(GEO_FLAGS_ORDER, []),
    order: GEO_FLAGS_ORDER,
    title: 'Geo Flags',
    submitModel$: () => EMPTY,
  };
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
          newGeoFlagsContract.initialModel = toCompleteRecord(GEO_FLAGS_ORDER, this.ugcItem.geoFlags ?? []);
          newGeoFlagsContract.submitModel$ = model => {
            const trueKeys =chain(model).toPairs().filter(([_k, v]) => !!v).map(([k, _v]) => k).value();
            return this.service.setUgcGeoFlag$(this.ugcItem.id, trueKeys)
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
    this.geoFlagsToggleListEzContract = cloneDeep(this.geoFlagsToggleListEzContract);
    this.geoFlagsToggleListEzContract.initialModel = geoFlags;
  }
}
