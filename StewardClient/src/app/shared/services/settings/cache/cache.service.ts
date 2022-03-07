import { Injectable } from '@angular/core';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';

/** Handles calls to the cache management API routes. */
@Injectable({
  providedIn: 'root',
})
export class CacheService {
  public basePath: string = 'v1/settings/cache';

  constructor(private readonly apiService: ApiService) {}

  /** Gets the cached key from API's memory. */
  public getCacheKey$(key: string): Observable<object> {
    return this.apiService.getRequest$<object>(`${this.basePath}/${key}`);
  }

  /** Deletes the cached key from API's memory. */
  public deleteCacheKey$(key: string): Observable<void> {
    return this.apiService.deleteRequest$<void>(`${this.basePath}/${key}`);
  }
}
