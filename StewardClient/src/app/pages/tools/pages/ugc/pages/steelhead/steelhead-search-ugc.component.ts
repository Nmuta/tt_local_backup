import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GameTitle, PegasusProjectionSlot } from '@models/enums';
import { catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcCurationType, UgcSearchFilters, UgcType } from '@models/ugc-filters';
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
import BigNumber from 'bignumber.js';
import { ActivatedRoute, Router } from '@angular/router';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import { SteelheadItemsService } from '@services/api-v2/steelhead/items/steelhead-items.service';
import { getToolsActivatedRoute } from '@helpers/tools-activated-route';
import { HelpPopoverIconComponent } from '@shared/modules/help/help-popover-icon/help-popover-icon.component';

/** Retreives and displays Steelhead ugc by search filters. */
@Component({
  selector: 'steelhead-search-ugc',
  templateUrl: './steelhead-search-ugc.component.html',
  styleUrls: ['./steelhead-search-ugc.component.scss'],
})
export class SteelheadSearchUgcComponent extends BaseComponent implements OnInit {
  @ViewChild(HelpPopoverIconComponent) helpPopoverIcon: HelpPopoverIconComponent;
  /** REVIEW-COMMENT: Pegasus slot id. Default to {@link PegasusProjectionSlot.Daily}. */
  @Input() public pegasusSlotId: PegasusProjectionSlot = PegasusProjectionSlot.Daily;
  public gameTitle = GameTitle.FM8;
  public searchUgc$ = new Subject<UgcSearchFilters>();
  public ugcContent: PlayerUgcItem[] = [];
  public getMonitor = new ActionMonitor('GET UGC Content');
  public ugcType: UgcType = UgcType.Unknown;
  public filterXuid: BigNumber = undefined;
  public ugcCuratedEnum = UgcCurationType;

  public serviceContract: UgcSearchFiltersServiceContract = {
    gameTitle: this.gameTitle,
    makeModelAutocompleteServiceContract: { getSimpleCars$: () => this.getSimpleCars$() },
    supportedUgcTypes: [UgcType.Livery, UgcType.Photo, UgcType.TuneBlob],
    specialIdentitiesAllowed: [],
    foundFn: this.foundFn,
    rejectionFn: this.rejectionFn,
  };

  public formControls = {
    ugcFilters: new FormControl('', Validators.required),
    ugcCuratedType: new FormControl(''),
  };

  public formGroup = new FormGroup(this.formControls);

  constructor(
    private readonly ugcLookupService: SteelheadUgcLookupService,
    private readonly itemsService: SteelheadItemsService,
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
    return this.ugcLookupService.searchUgc$(searchParameters);
  }

  /** Load curated UGC queues. */
  public loadCuratedUgc(): void {
    const ugcFilters = this.formControls.ugcFilters.value as UgcSearchFilters;
    this.ugcContent = [];
    this.getMonitor = this.getMonitor.repeat();
    this.ugcLookupService
      .getCuratedUgc$(ugcFilters.ugcType, this.formControls.ugcCuratedType.value)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(results => {
        this.ugcContent = results;
      });
  }

  /** Gets master inventory list */
  public getSimpleCars$(): Observable<SimpleCar[]> {
    return this.itemsService.getSimpleCars$(this.pegasusSlotId);
  }

  /** Logic when player details tool button is clicked. */
  public playerDetailsClick(): void {
    // TODO: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1293600
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
    if (!identity?.extra?.hasSteelhead) {
      return 'Player does not have a steelhead account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Produces title specific identity, if it exists. */
  public foundFn(newIdentity: AugmentedCompositeIdentity): IdentityResultAlpha | null {
    if (newIdentity?.steelhead?.error) {
      return null;
    }

    return newIdentity?.steelhead;
  }
}
