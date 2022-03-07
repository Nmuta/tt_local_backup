import { Injectable } from '@angular/core';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';
import { LspEndpoints } from '@models/lsp-endpoints';
import { ToolsAvailability } from '@models/blob-storage';
import { HttpHeaders } from '@angular/common/http';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public basePath: string = 'v1/settings';

  constructor(private readonly apiService: ApiService) {}

  /** Gets supported LSP endpoints. */
  public getLspEndpoints$(): Observable<LspEndpoints> {
    return this.apiService.getRequest$<LspEndpoints>(`${this.basePath}/lspEndpoints`);
  }

  /** Sets tool availability. */
  public setToolAvailability$(
    updateToolsAvailability: ToolsAvailability,
  ): Observable<ToolsAvailability> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.apiService.postRequest$<ToolsAvailability>(
      `${this.basePath}/tools/availability`,
      updateToolsAvailability,
      undefined,
      headers,
    );
  }
}
