import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ForzaSandbox } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { ResetProfileOptions } from '@models/reset-profile-options';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/steelhead/player/profile endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerProfileService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Saves player profile to a template. */
  public savePlayerProfileTemplate$(
    xuid: BigNumber,
    profileId: GuidLikeString,
    templateName: string,
    overwriteIfExists: boolean = false,
  ): Observable<void> {
    const params = new HttpParams().set('overwriteIfExists', overwriteIfExists.toString());

    return this.api.postRequest$<void>(
      `${this.basePath}/${xuid}/profile/${profileId}/save`,
      templateName,
      params,
    );
  }

  /** Loads profile template to a player's profile. */
  public loadTemplateToPlayerProfile$(
    xuid: BigNumber,
    profileId: GuidLikeString,
    templateName: string,
    continueOnBreakingChanges: boolean = false,
    forzaSandbox: ForzaSandbox,
  ): Observable<GuidLikeString> {
    const params = new HttpParams().append('continueOnBreakingChanges', continueOnBreakingChanges.toString()).append('forzaSandbox', forzaSandbox);

    return this.api.postRequest$<GuidLikeString>(
      `${this.basePath}/${xuid}/profile/${profileId}/load`,
      templateName,
      params,
    );
  }

  /** Resets player's profile. */
  public resetPlayerProfile$(
    xuid: BigNumber,
    profileId: GuidLikeString,
    options: ResetProfileOptions,
  ): Observable<GuidLikeString> {
    const params = new HttpParams({ fromObject: { ...options } });

    return this.api.postRequest$<GuidLikeString>(
      `${this.basePath}/${xuid}/profile/${profileId}/reset`,
      null,
      params,
    );
  }
}
