import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { UgcType } from '@models/ugc-filters';
import { takeUntil } from 'rxjs';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';

/** Routed component that displays nav information for Woodstock UGC searches. */
@Component({
  templateUrl: './woodstock-ugc-details.component.html',
  styleUrls: ['./woodstock-ugc-details.component.scss'],
})
export class WoodstockUgcDetailsComponent extends BaseComponent implements OnInit {
  public GameTitleCodeName = GameTitleCodeName;

  public supportedTypes = [UgcType.Livery, UgcType.Photo, UgcType.Tune];
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
    if (this.sharedLookupService.locations?.fh5) {
      for (const type of this.sharedLookupService.locations.fh5) {
        this.hasTypeLookup[type as UgcType] = true;
      }
    }
  }
}
