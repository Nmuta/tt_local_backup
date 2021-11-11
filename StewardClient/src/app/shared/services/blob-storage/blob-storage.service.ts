import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToolsAvailability } from '@models/blob-storage';
import { Observable } from 'rxjs';

/** Handles calls to blob storage. */
@Injectable({
  providedIn: 'root',
})
export class BlobStorageService {
  public basePath: string = 'https://stewardblobprod.blob.core.windows.net';

  constructor(private readonly http: HttpClient) {}

  /** Gets tool availability. */
  public getToolAvailability$(): Observable<ToolsAvailability> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<ToolsAvailability>(`${this.basePath}/settings/tool-availability.json`, {
      headers,
    });
  }
}
