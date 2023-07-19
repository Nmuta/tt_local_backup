import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcTableBaseComponent } from '../ugc-table.component';
import { ApolloService } from '@services/apollo';
import { UgcType } from '@models/ugc-filters';
import { Observable, throwError } from 'rxjs';
import { GuidLikeString } from '@models/extended-types';
import { LookupThumbnailsResult } from '@models/ugc-thumbnail-lookup';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BulkGenerateSharecodeResponse } from '@services/api-v2/woodstock/ugc/sharecode/woodstock-ugc-sharecode.service';
import { BulkReportUgcResponse } from '@services/api-v2/woodstock/ugc/report/woodstock-ugc-report.service';

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

  constructor(private readonly apolloService: ApolloService, snackbar: MatSnackBar) {
    super(snackbar);
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
    return throwError(new Error('Apollo does not support hiding ugc items.'));
  }

  /** Unhide multiple Ugcs. */
  public unhideUgc(_ugcIds: string[]): Observable<string[]> {
    return throwError(new Error('Apollo does not support bulk unhide UGC.'));
  }

  /** Generate multiple Sharecodes. */
  public generateSharecodes(_ugcIds: string[]): Observable<BulkGenerateSharecodeResponse[]> {
    return throwError(new Error('Apollo does not support bulk sharecode generation.'));
  }

  /** Report multiple Ugcs. */
  public reportUgc(_ugcIds: string[], _reasonId: string): Observable<BulkReportUgcResponse[]> {
    return throwError(new Error('Apollo does not support reporting ugc items.'));
  }
}
