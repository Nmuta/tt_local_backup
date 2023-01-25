import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GameTitle, PegasusProjectionSlot } from '@models/enums';
import { catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcSearchFilters, UgcType, WoodstockSupportedUgcTypes } from '@models/ugc-filters';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  UgcSearchFiltersFormValue,
  UgcSearchFiltersServiceContract,
} from '@views/ugc-search-filters/ugc-search-filters.component';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SimpleCar } from '@models/cars';
import { WoodstockService } from '@services/woodstock';
import BigNumber from 'bignumber.js';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpPopoverIconComponent } from '@shared/modules/help/help-popover-icon/help-popover-icon.component';
import { getToolsActivatedRoute } from '@helpers/tools-activated-route';
import { WoodstockUgcSearchService } from '@services/api-v2/woodstock/ugc/search/woodstock-ugc-search.service';

/** Retreives and displays Woodstock ugc by search filters. */
@Component({
  selector: 'woodstock-search-ugc',
  templateUrl: './woodstock-search-ugc.component.html',
  styleUrls: ['./woodstock-search-ugc.component.scss'],
})
export class WoodstockSearchUgcComponent extends BaseComponent implements OnInit {
  @ViewChild(HelpPopoverIconComponent) helpPopoverIcon: HelpPopoverIconComponent;
  /** Pegasus slot id. Used to determine CMS slot used to fill in car details on UGC items. Defaults to {@link PegasusProjectionSlot.Live}. */
  @Input() public pegasusSlotId: PegasusProjectionSlot = PegasusProjectionSlot.Live;
  public gameTitle = GameTitle.FH5;
  public searchUgc$ = new Subject<UgcSearchFilters>();
  public ugcContent: PlayerUgcItem[] = [];
  public getMonitor = new ActionMonitor('GET UGC Content');
  public ugcType: UgcType = UgcType.Unknown;
  public filterXuid: BigNumber = undefined;

  public serviceContract: UgcSearchFiltersServiceContract = {
    gameTitle: this.gameTitle,
    makeModelAutocompleteServiceContract: { getSimpleCars$: () => this.getSimpleCars$() },
    supportedUgcTypes: WoodstockSupportedUgcTypes,
    foundFn: this.foundFn,
    rejectionFn: this.rejectionFn,
  };

  public formControls = {
    ugcFilters: new FormControl('', Validators.required),
  };

  public formGroup = new FormGroup(this.formControls);

  constructor(
    private readonly searchService: WoodstockUgcSearchService,
    private readonly woodstockService: WoodstockService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.searchUgc$
      .pipe(
        tap(() => {
          this.ugcContent = [];
        }),
        switchMap(filters => {
          this.ugcType = filters.ugcType;
          this.getMonitor = this.getMonitor.repeat();

          return this.getSystemUgc$(filters).pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => EMPTY),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(results => {
        this.ugcContent = results;
      });

    this.formControls.ugcFilters.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((filters: UgcSearchFiltersFormValue) => {
        this.filterXuid = filters.xuid || undefined;
      });
  }

  /** Searches player UGC content. */
  public searchUgc(): void {
    this.searchUgc$.next(this.formControls.ugcFilters.value);
  }

  /** Searches player UGC content. */
  public getSystemUgc$(searchParameters: UgcSearchFilters): Observable<PlayerUgcItem[]> {
    return this.searchService.searchUgc$(searchParameters);
  }

  /** Gets master inventory list */
  public getSimpleCars$(): Observable<SimpleCar[]> {
    return this.woodstockService.getSimpleCars$(this.pegasusSlotId);
  }

  /** Logic when player details tool button is clicked. */
  public playerDetailsClick(): void {
    const toolsRoute = getToolsActivatedRoute(this.route);
    const queryParams = {};
    queryParams['xuid'] = this.filterXuid;
    this.router.navigate([`user-details/${this.gameTitle}`], {
      relativeTo: toolsRoute,
      queryParams: queryParams,
      replaceUrl: false,
    });
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public rejectionFn(identity: AugmentedCompositeIdentity): string | null {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Produces title specific identity, if it exists. */
  public foundFn(newIdentity: AugmentedCompositeIdentity): IdentityResultAlpha | null {
    if (newIdentity?.woodstock?.error) {
      return null;
    }

    return newIdentity?.woodstock;
  }
}
