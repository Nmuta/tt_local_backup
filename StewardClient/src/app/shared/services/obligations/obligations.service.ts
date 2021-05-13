import { Injectable } from '@angular/core';
import { SimplifiedObligationPipeline } from '@models/pipelines/simplified-obligation-pipeline';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';

/** API Endpoints for Obligations Service. */
@Injectable({
  providedIn: 'root',
})
export class ObligationsService {
  public basePath: string = 'v1/pipeline';

  constructor(private readonly apiService: ApiService) {}

  /** Get an existing pipeline by name. */
  public get$(name: string): Observable<SimplifiedObligationPipeline> {
    return this.apiService.getRequest$<SimplifiedObligationPipeline>(`${this.basePath}/${name}`);
  }

  /** Create a new pipeline or update an existing one safely. */
  public put$(pipeline: SimplifiedObligationPipeline): Observable<string> {
    return this.apiService.putRequest$<string>(`${this.basePath}`, pipeline);
  }

  /** Create a new pipeline or crush an existing one, regardless of safety. */
  public post$(pipeline: SimplifiedObligationPipeline): Observable<string> {
    return this.apiService.postRequest$<string>(`${this.basePath}`, pipeline);
  }

  /** Delete an existing pipeline. */
  public delete$(name: string): Observable<string> {
    return this.apiService.deleteRequest$<string>(`${this.basePath}/${name}`);
  }
}
