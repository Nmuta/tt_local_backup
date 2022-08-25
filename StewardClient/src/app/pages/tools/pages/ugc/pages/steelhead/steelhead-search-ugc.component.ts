import { Component, Input, OnInit } from '@angular/core';
import { GameTitle, PegasusProjectionSlot } from '@models/enums';
import { catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UgcSearchFiltersServiceContract } from '@views/ugc-search-filters/ugc-search-filters.component';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { DetailedCar } from '@models/detailed-car';
import BigNumber from 'bignumber.js';
import { Params } from '@angular/router';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import { SteelheadItemsService } from '@services/api-v2/steelhead/items/steelhead-items.service';

/** Retreives and displays Steelhead ugc by search filters. */
@Component({
  selector: 'steelhead-search-ugc',
  templateUrl: './steelhead-search-ugc.component.html',
  styleUrls: ['./steelhead-search-ugc.component.scss'],
})
export class SteelheadSearchUgcComponent extends BaseComponent implements OnInit {
  @Input() public pegasusSlotId: PegasusProjectionSlot = PegasusProjectionSlot.Live;
  public gameTitle = GameTitle.FM8;
  public searchUgc$ = new Subject<UgcSearchFilters>();
  public ugcContent: PlayerUgcItem[] = [];
  public getMonitor = new ActionMonitor('GET UGC Content');
  public ugcType: UgcType = UgcType.Unknown;
  public filterXuid: BigNumber = undefined;
  public routerLink: string = '/app/tools/user-details/steelhead';
  public routerParams: Params = undefined;

  public serviceContract: UgcSearchFiltersServiceContract = {
    gameTitle: this.gameTitle,
    makeModelAutocompleteServiceContract: { getDetailedCars$: () => this.getDetailedCars$() },
    supportedUgcTypes: [UgcType.Livery, UgcType.Photo, UgcType.Tune],
    foundFn: this.foundFn,
    rejectionFn: this.rejectionFn,
  };

  public formControls = {
    ugcFilters: new FormControl('', Validators.required),
  };

  public formGroup = new FormGroup(this.formControls);

  constructor(
    private readonly ugcLookupService: SteelheadUgcLookupService,
    private readonly itemsService: SteelheadItemsService,
  ) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.searchUgc$
      .pipe(
        tap(() => {
          this.ugcContent = [];
          this.filterXuid = undefined;
          this.routerParams = undefined;
        }),
        switchMap(filters => {
          this.ugcType = filters.ugcType;

          if (filters.xuid) {
            this.filterXuid = filters.xuid;
            this.routerParams = { lookupType: 'xuid', lookupName: filters.xuid };
          }

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
  }

  /** Searches player UGC content. */
  public searchUgc(): void {
    this.searchUgc$.next(this.formControls.ugcFilters.value);
  }

  /** Searches player UGC content. */
  public getSystemUgc$(searchParameters: UgcSearchFilters): Observable<PlayerUgcItem[]> {
    return this.ugcLookupService.searchUgc$(searchParameters);
  }

  /** Gets master inventory list */
  public getDetailedCars$(): Observable<DetailedCar[]> {
    return this.itemsService.getDetailedCars$(this.pegasusSlotId);
  }

  /** Logic when UGC filters have changed. */
  public changeUgcSearchParameters($event: UgcSearchFilters): void {
    this.searchUgc$.next($event);
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
