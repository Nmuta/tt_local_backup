import { Injectable } from '@angular/core';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';
import { LspEndpoints } from '@models/lsp-endpoints';

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
}
