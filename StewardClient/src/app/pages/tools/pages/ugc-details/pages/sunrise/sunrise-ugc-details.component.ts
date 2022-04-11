import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { UgcType } from '@models/ugc-filters';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';

/** Routed component that displays nav information for Sunrise UGC searches. */
@Component({
  templateUrl: './sunrise-ugc-details.component.html',
  styleUrls: ['./sunrise-ugc-details.component.scss'],
})
export class SunriseUgcDetailsComponent extends BaseComponent implements OnInit {
  public GameTitleCodeName = GameTitleCodeName;

  public supportedTypes = [UgcType.Livery, UgcType.Photo, UgcType.Tune];
  public hasTypeLookup = {};

  constructor(public readonly sharedLookupService: ScopedSharedLookupService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.applyData();
    this.sharedLookupService.latestResults$.subscribe(() => this.applyData());
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
