import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { UgcType } from '@models/ugc-filters';
import { first } from 'lodash';
import { takeUntil } from 'rxjs';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';

/** Routed component to handle automatic redirect to a specific type, if only one exists.*/
@Component({
  templateUrl: './steelhead-redirect.component.html',
  styleUrls: ['./steelhead-redirect.component.scss'],
})
export class SteelheadRedirectComponent extends BaseComponent implements OnInit {
  public supportedTypes = [UgcType.Livery, UgcType.Photo, UgcType.Tune];
  public hasTypeLookup = {};

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly sharedLookupService: ScopedSharedLookupService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.doRedirect();
    this.sharedLookupService.latestResults$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.doRedirect());
  }

  private doRedirect(): void {
    if (this.sharedLookupService.locations?.fm8?.length === 1) {
      const onlyExistingType = first(this.sharedLookupService.locations.fm8);
      this.router.navigate(['.', onlyExistingType.toLowerCase()], { relativeTo: this.route });
    }
  }
}
