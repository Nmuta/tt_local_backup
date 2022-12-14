import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { UgcType } from '@models/ugc-filters';
import { first } from 'lodash';
import { takeUntil } from 'rxjs';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';

/** Routed component to handle automatic redirect to a specific type, if only one exists.*/
@Component({
  templateUrl: './woodstock-redirect.component.html',
  styleUrls: ['./woodstock-redirect.component.scss'],
})
export class WoodstockRedirectComponent extends BaseComponent implements OnInit {
  public GameTitleCodeName = GameTitleCodeName;

  public supportedTypes = [UgcType.Livery, UgcType.Photo, UgcType.Tune, UgcType.EventBlueprint];
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
    if (this.sharedLookupService.locations?.fh5?.length === 1) {
      const onlyExistingType = first(this.sharedLookupService.locations.fh5);
      this.router.navigate(['.', onlyExistingType.toLowerCase()], { relativeTo: this.route });
    }
  }
}
