import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

export interface UgcProfileInfo {
  updateCount: BigNumber;
  profileData: string;
  DecompressionData: UgcProfileDecompressionData;
}

export interface UgcProfileDecompressionData {
  compressedDataLengthIsValid: boolean;
  uncompressedDataLengthIsValid: boolean;
  expectedCompressedDataLength: BigNumber;
  expectedUncompressedDataLength: BigNumber;
  actualCompressedDataLength: BigNumber;
  actualUncompressedDataLength: BigNumber;
}

/** The /v2/title/steelhead/player/{xuid}/profile/{profileId}/ugcProfile endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerUgcProfileService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets player UGC profile. */
  public getUgcProfile$(xuid: BigNumber, profileId: GuidLikeString): Observable<UgcProfileInfo> {
    return this.api.getRequest$<UgcProfileInfo>(
      `${this.basePath}/${xuid}/profile/${profileId}/ugcProfile`,
    );
  }

  /** Sets player UGC profile. */
  public updateUgcProfile$(
    xuid: BigNumber,
    profileId: GuidLikeString,
    profileData: string,
  ): Observable<void> {
    return this.api.postRequest$<void>(
      `${this.basePath}/${xuid}/profile/${profileId}/ugcProfile`,
      profileData,
    );
  }
}
