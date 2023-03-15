import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { SunriseExtendedSupportedUgcTypes, UgcType } from '@models/ugc-filters';
import { takeUntil } from 'rxjs';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';

/** Routed component that displays nav information for Sunrise UGC searches. */
@Component({
  templateUrl: './sunrise-ugc-details.component.html',
  styleUrls: ['./sunrise-ugc-details.component.scss'],
})
export class SunriseUgcDetailsComponent extends BaseComponent implements OnInit {
  public GameTitleCodeName = GameTitleCodeName;

  public supportedTypes = SunriseExtendedSupportedUgcTypes;
  public hasTypeLookup = {};

  constructor(public readonly sharedLookupService: ScopedSharedLookupService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.applyData();
    this.sharedLookupService.latestResults$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.applyData());
  }

  private applyData(): void {
    this.hasTypeLookup = {};
    if (this.sharedLookupService.locations?.fh4) {
      for (const type of this.sharedLookupService.locations.fh4) {
        this.hasTypeLookup[type as UgcType] = true;
      }
    }
  }
}
