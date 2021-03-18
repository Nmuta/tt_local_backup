import { Injectable } from '@angular/core';
import { AllKustoQueries, KustoQueryResponse } from '@models/kusto';
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
  public getKustoQueries(): Observable<AllKustoQueries> {
    return this.apiService.getRequest<AllKustoQueries>(`${this.basePath}/queries`);
  }

  /** Runs a query against Kusto. */
  public postRunKustoQuery(query: string): Observable<KustoQueryResponse> {
    return this.apiService.postRequest<KustoQueryResponse>(`${this.basePath}/run`, query);
  }
}
