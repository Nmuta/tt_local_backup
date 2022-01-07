import BigNumber from 'bignumber.js';
import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerAuction } from '@models/player-auction';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuctionFilters, DefaultAuctionFilters } from '@models/auction-filters';
import { ImageModalComponent, ImageModalData } from '@views/image-modal/image-modal.component';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  template: '',
})
export abstract class PlayerAuctionsBaseComponent
  extends BaseComponent
  implements OnChanges, AfterViewInit
{
  @Input() public identity?: IdentityResultUnion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public readonly NO_AUCTION_IMAGE_SRC =
    'https://admin.fh4.forzamotorsport.net/GetStorefrontThumb.ashx?id=2cc3c956-6c36-4e90-95e6-54c9a80190f5&fmt=AuctionAdmin';

  public auctions = new MatTableDataSource<PlayerAuction>([]);
  public columnsToDisplay = [
    'auctionInfo',
    'pricingInfo',
    'enforcementInfo',
    'liveryImageBase64',
    'textureMapImageBase64',
    'actions',
  ];

  public getAuctionsByXuid$ = new Subject<void>();

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  private currentFilters = DefaultAuctionFilters;

  public abstract gameTitle: GameTitleCodeName;

  constructor(private readonly dialog: MatDialog) {
    super();

    this.getAuctionsByXuid$
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.loadError = undefined;
          this.auctions.data = [];
        }),
        switchMap(() => {
          return this.getPlayerAuctionsByXuid$(this.identity.xuid, this.currentFilters).pipe(
            catchError(error => {
              this.isLoading = false;
              this.loadError = error;
              return EMPTY;
            }),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(results => {
        this.isLoading = false;
        this.auctions.data = results;
      });
  }

  /** Gets the player auctions by XUID. */
  public abstract getPlayerAuctionsByXuid$(
    xuid: BigNumber,
    filters: AuctionFilters,
  ): Observable<PlayerAuction[]>;

  /** Angular on changes hook. */
  public ngOnChanges(): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.currentFilters = DefaultAuctionFilters;
    this.getAuctionsByXuid$.next();
  }

  /** After view angular hook. */
  public ngAfterViewInit(): void {
    this.auctions.paginator = this.paginator;
    this.getAuctionsByXuid$.next();
  }

  /** Opens image model to view image. */
  public enlargeImage(title: string, url: string): void {
    this.dialog.open(ImageModalComponent, {
      data: { title: title, url: url } as ImageModalData,
    });
  }

  /** Search auctions */
  public searchAuctions($event: AuctionFilters): void {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    this.currentFilters = $event;
    this.getAuctionsByXuid$.next();
  }
}
