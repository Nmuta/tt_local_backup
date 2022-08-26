import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { onlyTrueKey } from '@helpers/only-true-key';
import { mergedParamMap } from '@helpers/param-map';
import { GameTitleCodeName } from '@models/enums';
import { chain } from 'lodash';
import { debounceTime, filter, map, pairwise, startWith, takeUntil } from 'rxjs';
import { ScopedSharedLookupService } from './services/scoped-shared-lookup.service';

/**
 * Routed component that displays the UGC Details toolbar and handles routing.
 */
@Component({
  templateUrl: './ugc-details.component.html',
  styleUrls: ['./ugc-details.component.scss'],
  providers: [ScopedSharedLookupService],
})
export class UgcDetailsComponent extends BaseComponent implements OnInit {
  public controls = {
    sharecode: new FormControl(''),
  };

  public GameTitleCodeName = GameTitleCodeName;

  public steelheadRouterLink = ['.', 'steelhead'];
  public woodstockRouterLink = ['.', 'woodstock'];
  public sunriseRouterLink = ['.', 'sunrise'];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly sharedLookupService: ScopedSharedLookupService,
  ) {
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
      .subscribe(id => {
        this.steelheadRouterLink = ['.', 'steelhead', id];
        this.woodstockRouterLink = ['.', 'woodstock', id];
        this.sunriseRouterLink = ['.', 'sunrise', id];
        this.controls.sharecode.setValue(id);
        this.sharedLookupService.doLookup(id);
      });

    this.automaticallyRedirect();
    this.sharedLookupService.latestResults$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.automaticallyRedirect());

    this.controls.sharecode.valueChanges
      .pipe(debounceTime(HCI.TypingToAutoSearchDebounceMillis), takeUntil(this.onDestroy$))
      .subscribe(id => {
        if (!id) {
          this.steelheadRouterLink = ['.', 'steelhead'];
          this.woodstockRouterLink = ['.', 'woodstock'];
          this.sunriseRouterLink = ['.', 'sunrise'];
          return; // do not redirect when there is a missing ID (this breaks things)
        }

        this.steelheadRouterLink = ['.', 'steelhead', id];
        this.woodstockRouterLink = ['.', 'woodstock', id];
        this.sunriseRouterLink = ['.', 'sunrise', id];
        this.sharedLookupService.doLookup(id);
        this.router.navigate([id], { relativeTo: this.route.children[0] });
      });
  }

  private automaticallyRedirect() {
    if (!this.sharedLookupService.locations) {
      return;
    }

    const titleLookup = chain(this.sharedLookupService.locations)
      .omit('shareCodeOrId')
      .mapValues(v => v.length > 0)
      .value();
    const paramMap = mergedParamMap(this.route.snapshot, true);
    if (paramMap['type']) {
      return; // do not redirect when we have already selected a type
    }

    if (onlyTrueKey(titleLookup, 'fh4')) {
      this.router.navigate(this.sunriseRouterLink, { relativeTo: this.route });
    } else if (onlyTrueKey(titleLookup, 'fh5')) {
      this.router.navigate(this.woodstockRouterLink, { relativeTo: this.route });
    } else if (onlyTrueKey(titleLookup, 'fm8')) {
      this.router.navigate(this.steelheadRouterLink, { relativeTo: this.route });
    }
  }
}
