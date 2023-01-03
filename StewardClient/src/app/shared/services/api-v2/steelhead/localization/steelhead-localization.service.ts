import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  public getLocalizedStrings$(useInternalIds: boolean = true): Observable<LocalizedStringsMap> {
    const params = new HttpParams().set('useInternalIds', useInternalIds);
    return this.api.getRequest$<LocalizedStringsMap>(this.basePath, params);
  }

  /** Submits string to Steelhead for localization. */
  public postLocalizedString$(localizedStringData: LocalizedStringData): Observable<void> {
    return this.api.postRequest$<void>(this.basePath, localizedStringData);
  }
}
