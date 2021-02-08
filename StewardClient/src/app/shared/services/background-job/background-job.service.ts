import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiService } from '@shared/services/api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Defines the User Service. */
@Injectable({
  providedIn: 'root',
})
export class BackgroundJobService {
  public basePath: string = 'v1/jobs';

  constructor(private apiService: ApiService) {}

  /** Gets the background job. */
  public getBackgroundJob<T>(jobId: string): Observable<BackgroundJob<T>> {
    return this.apiService.getRequest<BackgroundJob<T>>(`${this.basePath}/jobId(${jobId})`).pipe(
      tap(job => {
        try {
          job.parsedResult = JSON.parse(job.result) as T;
        } catch(err) { /** Do nothing, just try to parse */}
      }),
    );
  }
}
