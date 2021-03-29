import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { KustoQuery, KustoQueryResponse } from '@models/kusto';
import { KustoQueries } from '@models/kusto/kusto-queries';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class KustoService {
  public basePath: string = 'v1/kusto';

  constructor(private readonly apiService: ApiService) {}

  /** Gets identities within this service. */
  public getKustoQueries(): Observable<KustoQueries> {
    return this.apiService.getRequest<KustoQueries>(`${this.basePath}/queries`);
  }

  /** Runs a query against Kusto. */
  public postRunKustoQuery(query: string): Observable<KustoQueryResponse> {
    return this.apiService.postRequest<KustoQueryResponse>(`${this.basePath}/query/run`, query);
  }

  /** Saves a new Kusto Query. */
  public postSaveNewKustoQuery(kustoQuery: KustoQuery): Observable<void> {
    return this.apiService.postRequest(`${this.basePath}/queries`, [kustoQuery]);
  }

  /** Replaces a Kusto Query. */
  public putReplaceKustoQuery(
    kustoQueryId: GuidLikeString,
    kustoQuery: KustoQuery,
  ): Observable<void> {
    return this.apiService.putRequest(`${this.basePath}/queries/id(${kustoQueryId})`, kustoQuery);
  }

  /** Deletes a Kusto Query. */
  public deleteKustoQuery(kustoQueryId: GuidLikeString): Observable<void> {
    return this.apiService.deleteRequest(`${this.basePath}/queries/id(${kustoQueryId})`);
  }
}
