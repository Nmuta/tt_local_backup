import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addEnvironmentAndSlotHttpParams } from '@helpers/query-param-helpers';
import { PullRequest } from '@models/git-operation';
import { LocalizedStringsMap, LocalizedStringData } from '@models/localization';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/localization endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadLocalizationService {
  public readonly basePath: string = 'title/steelhead/localization';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets localized strings for Steelhead. */
  public getLocalizedStrings$(
    useInternalIds: boolean = true,
    environment: string = null,
    slot: string = null,
  ): Observable<LocalizedStringsMap> {
    let params = new HttpParams().set('useInternalIds', useInternalIds);
    params = addEnvironmentAndSlotHttpParams(environment, slot, params);

    return this.api.getRequest$<LocalizedStringsMap>(this.basePath, params);
  }

  /** Submits string to Steelhead for localization. */
  public postLocalizedString$(localizedStringData: LocalizedStringData): Observable<PullRequest> {
    return this.api.postRequest$<PullRequest>(this.basePath, localizedStringData);
  }
}
