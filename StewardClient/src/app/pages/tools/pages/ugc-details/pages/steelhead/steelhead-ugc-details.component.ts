import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { UgcType } from '@models/ugc-filters';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';

/** Routed component that displays nav information for Steelhead UGC searches. */
@Component({
  templateUrl: './steelhead-ugc-details.component.html',
  styleUrls: ['./steelhead-ugc-details.component.scss'],
})
export class SteelheadUgcDetailsComponent extends BaseComponent implements OnInit {
  public supportedTypes = [UgcType.Livery, UgcType.Photo, UgcType.TuneBlob];
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
    if (this.sharedLookupService.locations?.fm8) {
      for (const type of this.sharedLookupService.locations.fm8) {
        this.hasTypeLookup[type as UgcType] = true;
      }
    }
  }
}
