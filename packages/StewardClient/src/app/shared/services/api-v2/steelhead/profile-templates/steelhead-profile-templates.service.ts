import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/profileTemplates endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadProfileTemplatesService {
  public readonly basePath: string = 'title/steelhead/profileTemplates';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets player profile templates. */
  public getProfileTemplates$(): Observable<string[]> {
    return this.api.getRequest$<string[]>(`${this.basePath}`);
  }
}
