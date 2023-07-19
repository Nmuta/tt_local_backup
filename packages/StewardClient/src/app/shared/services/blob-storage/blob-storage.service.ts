import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PlayFabSettings, ToolsAvailability } from '@models/blob-storage';
import { Observable } from 'rxjs';

/** Handles calls to blob storage. */
@Injectable({
  providedIn: 'root',
})
export class BlobStorageService {
  constructor(private readonly http: HttpClient) {}

  /** Gets tool availability. */
  public getToolAvailability$(): Observable<ToolsAvailability> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    });
    return this.http.get<ToolsAvailability>(
      `${environment.stewardBlobStorageUrl}/settings/tool-availability.json`,
      {
        headers,
      },
    );
  }

  /** Gets PlayFab settings. */
  public getPlayFabSettings$(): Observable<PlayFabSettings> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    });
    return this.http.get<PlayFabSettings>(
      `${environment.stewardBlobStorageUrl}/settings/playfab.json`,
      {
        headers,
      },
    );
  }
}
