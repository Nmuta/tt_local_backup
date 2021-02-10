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
          const parsedResult = JSON.parse(job.result) as T;
          if (Array.isArray(parsedResult)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            job.parsedResult = (parsedResult as any).map(data => {
              return this.lowercaseProperties(data);
            });
          } else {
            job.parsedResult = this.lowercaseProperties(parsedResult);
          }
        } catch (err) {
          /** Do nothing, just try to parse */
        }
      }),
    );
  }

  /** Converts each properties first letter to lowercase. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private lowercaseProperties(object: any): any {
    const objectWithLowercaseProps = {};
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
          const newKey = key.charAt(0).toLowerCase() + key.slice(1);
          objectWithLowercaseProps[newKey] = object[key];
      }
    }
    return objectWithLowercaseProps;
  }
}
