import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { MatDialog } from '@angular/material/dialog';
import { PlayerUgcItemTableEntries, UgcTableBaseComponent } from '../ugc-table.component';
import { ApolloService } from '@services/apollo';
import { UgcType } from '@models/ugc-filters';
import { Observable, throwError } from 'rxjs';
import { PermissionsService } from '@services/permissions';
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
  public supportFeaturing: boolean = false;
  public supportHiding: boolean = false;
  public ugcDetailsLinkSupported: boolean = false;

  constructor(
    protected dialog: MatDialog,
    private readonly apolloService: ApolloService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets player UGC item. */
  public getUgcItem(id: string, type: UgcType): Observable<PlayerUgcItem> {
    return this.apolloService.getPlayerUgcItem$(id, type);
  }

  /** Opens the feature UGC modal. */
  public openFeatureUgcModal(_item: PlayerUgcItem): void {
    throw new Error('Apollo does not support featuring UGC');
  }

  /** Hides UGC item.  */
  public hideUgcItem(_item: PlayerUgcItemTableEntries): void {
    throw new Error('Apollo does not support hiding UGC');
  }

  /** Retrieve Photo thumnbnails. */
  public retrievePhotoThumbnails(_ugcIds: GuidLikeString[]): Observable<LookupThumbnailsResult[]> {
    return throwError(new Error('Apollo does not support bulk photo thumbnail lookup.'));
  }
}
