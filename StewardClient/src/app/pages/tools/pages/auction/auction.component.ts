import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';
import { debounceTime, filter, map, pairwise, startWith, takeUntil } from 'rxjs/operators';

/**
 * Routed component that displays the Auction toolbar and handles routing.
 */
@Component({
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
})
export class AuctionComponent extends BaseComponent implements OnInit {
  public controls = {
    auctionId: new FormControl(''),
  };

  public gameTitleCodeName = GameTitleCodeName;

  public woodstockRouterLink = ['.', 'woodstock'];
  public sunriseRouterLink = ['.', 'sunrise'];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.route.firstChild?.firstChild?.paramMap
      ?.pipe(
        map(params => params.get('id')),
        startWith(null),
        pairwise(),
        filter(([prev, cur]) => {
          return prev !== cur;
        }),
        map(([_prev, cur]) => cur),
      )
      .subscribe(auctionId => this.controls.auctionId.setValue(auctionId));

    this.controls.auctionId.valueChanges
      .pipe(debounceTime(HCI.TypingToAutoSearchDebounceMillis), takeUntil(this.onDestroy$))
      .subscribe(auctionId => {
        if (!!auctionId) {
          this.woodstockRouterLink = ['.', 'woodstock', auctionId];
          this.sunriseRouterLink = ['.', 'sunrise', auctionId];
          this.router.navigate([auctionId], { relativeTo: this.route.children[0] });
        } else {
          this.woodstockRouterLink = ['.', 'woodstock'];
          this.sunriseRouterLink = ['.', 'sunrise'];
          this.router.navigate(['.'], { relativeTo: this.route.children[0] });
        }
      });
  }
}
