import { Injectable } from '@angular/core';
import { LspGroups } from '@models/lsp-group';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/usergroup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUserGroupService {
  private basePath: string = 'title/steelhead/usergroup';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Steelhead lsp groups. */
  public getLspGroups$(): Observable<LspGroups> {
    return this.api.getRequest$<LspGroups>(`${this.basePath}`);
  }
}
