import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { mergedParamMap$ } from '@helpers/param-map';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { SunriseUgcHideService } from '@services/api-v2/sunrise/ugc/hide/sunrise-ugc-hide.service';
import { OldPermissionServiceTool, OldPermissionsService } from '@services/old-permissions';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { SunriseService } from '@services/sunrise';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { SunriseFeatureUgcModalComponent } from '@views/feature-ugc-modal/sunrise/sunrise-feature-ugc-modal.component';
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

/** Routed component that displays details about a sunrise UGC item. */
@Component({
  templateUrl: './sunrise-lookup.component.html',
  styleUrls: ['./sunrise-lookup.component.scss'],
})
export class SunriseLookupComponent extends BaseComponent implements OnInit {
  public ugcItem: PlayerUgcItem;
  public getMonitor = new ActionMonitor('GET UGC Monitor');
  public hideMonitor = new ActionMonitor('Post Hide UGC');

  public userHasWritePerms: boolean = false;
  public canFeatureUgc: boolean = false;
  public canHideUgc: boolean = false;
  public featureMatTooltip: string = null;
  private readonly privateUgcTooltip = 'Cannot feature private UGC content';
  private readonly incorrectPermsTooltip = 'This action is restricted for your user role';

  public featurePermAttribute = PermAttributeName.FeatureUgc;
  public hidePermAttribute = PermAttributeName.HideUgc;
  public gameTitle = GameTitle.FH4;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: SunriseService,
    private readonly permissionsService: OldPermissionsService,
    private readonly ugcHideService: SunriseUgcHideService,
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
          this.featureMatTooltip = this.incorrectPermsTooltip;
        } else if (!this.ugcItem?.isPublic) {
          this.featureMatTooltip = this.privateUgcTooltip;
        }
      });
  }

  /** Features a UGC item in Sunrise */
  public featureUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }

    this.dialog
      .open(SunriseFeatureUgcModalComponent, {
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

  /** Hide a UGC item in Sunrise */
  public hideUgcItem(): void {
    if (!this.ugcItem) {
      return;
    }
    this.hideMonitor = this.hideMonitor.repeat();

    this.ugcHideService
      .hideUgcItems$([this.ugcItem.id])
      .pipe(this.hideMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.canFeatureUgc = false;
        this.canHideUgc = false;
      });
  }
}
