import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { onlyTrueKey } from '@helpers/only-true-key';
import { mergedParamMap, mergedParamMap$ } from '@helpers/param-map';
import { renderGuard } from '@helpers/rxjs';
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

  /** Hook for "Navigate back" event. */
  @HostListener('window:popstate', ['$event'])
  onPopState(_event: unknown) {
    renderGuard(() => {
      // TODO: This should likely be an optional feature on `mergedParamMap$` which also triggers on back events.
      // But it's unclear how to add that at the moment.
      //
      // This entire issue boils down to a "bug" (read: unintuitive behavior) in the way angular paramMaps are handled.
      // When you navigate back, you are removing the param from the map. This does not trigger an angular update.
      // You are navigating FROM the route which now has no entries whatsoever (since it's not on the route), so no update is triggered.
      // You are navigating back TO the segment of the route that had no ID. So the segments are the same and no update is triggered.
      //
      // Further, none of these changes are detected until an epsilon of time has passed,
      // so we have to put this in a renderguard to wait for the paramMaps to update in the snapshot.
      const childSnapshot = this.route.firstChild?.firstChild.snapshot;
      const id = childSnapshot.paramMap.get('id');
      this.controls.sharecode.setValue(id);
    });
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    mergedParamMap$(this.route.firstChild?.firstChild)
      ?.pipe(
        map(params => params['id']),
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

        // Remove whitespace from UGC share codes
        const cleanedId = id.replace(/\s/g, '');

        this.steelheadRouterLink = ['.', 'steelhead', cleanedId];
        this.woodstockRouterLink = ['.', 'woodstock', cleanedId];
        this.sunriseRouterLink = ['.', 'sunrise', cleanedId];

        this.sharedLookupService.doLookup(cleanedId);

        this.router.navigate([cleanedId], {
          relativeTo: this.route.children[0],
          skipLocationChange: true,
        });
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
