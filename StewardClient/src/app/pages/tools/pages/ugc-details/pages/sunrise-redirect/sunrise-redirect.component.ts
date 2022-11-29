import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { UgcType } from '@models/ugc-filters';
import { first } from 'lodash';
import { takeUntil } from 'rxjs';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';
import { UgcDetailsComponent } from '../../ugc-details.component';

/** Routed component to handle automatic redirect to a specific type, if only one exists.*/
@Component({
  templateUrl: './sunrise-redirect.component.html',
  styleUrls: ['./sunrise-redirect.component.scss'],
})
export class SunriseRedirectComponent extends BaseComponent implements OnInit {
  public GameTitleCodeName = GameTitleCodeName;

  public supportedTypes = [UgcType.Livery, UgcType.Photo, UgcType.Tune];
  public hasTypeLookup = {};

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly sharedLookupService: ScopedSharedLookupService,
    @Inject(forwardRef(() => UgcDetailsComponent)) public parent: UgcDetailsComponent,
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
    if (this.sharedLookupService.locations?.fh4?.length === 1) {
      const onlyExistingType = first(this.sharedLookupService.locations.fh4);
      this.router.navigate(['.', onlyExistingType.toLowerCase()], { relativeTo: this.route });
    }
  }
}
