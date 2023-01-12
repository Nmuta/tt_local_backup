import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcTableBaseComponent } from '../ugc-table.component';
import { ApolloService } from '@services/apollo';
import { UgcType } from '@models/ugc-filters';
import { Observable, throwError } from 'rxjs';
import { GuidLikeString } from '@models/extended-types';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';

/** Displays apollo UGC content in a table. */
@Component({
  selector: 'apollo-ugc-table',
  templateUrl: '../ugc-table.component.html',
  styleUrls: ['../ugc-table.component.scss'],
})
export class ApolloUgcTableComponent extends UgcTableBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FM7;
  public ugcDetailsLinkSupported: boolean = false;
  public ugcHidingSupported = false;

  constructor(private readonly apolloService: ApolloService) {
    super();
  }

  /** Gets player UGC item. */
  public getUgcItem(id: string, type: UgcType): Observable<PlayerUgcItem> {
    return this.apolloService.getPlayerUgcItem$(id, type);
  }

  /** Retrieve Photo thumnbnails. */
  public retrievePhotoThumbnails(_ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return throwError(new Error('Apollo does not support bulk photo thumbnail lookup.'));
  }

  /** Hide multiple Ugcs. */
  public hideUgc(_ugcIds: string[]): Observable<string[]> {
    return throwError(new Error('Sunrise does not support bulk photo thumbnail lookup.'));
  }
}
