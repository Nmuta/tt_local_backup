import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { DateTime } from 'luxon';
import { GuidLikeString } from '@models/extended-types';
import BigNumber from 'bignumber.js';
import { ObjectEntry } from '@shared/modules/model-dump/helpers';

/** The /v2/title/woodstock/servicesTableStorage. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockServicesTableStorageService {
  public readonly basePath: string = 'title/woodstock/servicesTableStorage';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets user table storage by a profile ID. */
  public getTableStorageByProfileId$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
  ): Observable<ServicesTableStorageEntity[]> {
    return this.api.getRequest$<ServicesTableStorageEntity[]>(
      `${this.basePath}/player/${xuid}/externalProfileId/${externalProfileId}`,
    );
  }
}

/** Represents a row from Services Table Storage. */
export interface ServicesTableStorageEntity {
  rowKey: string;
  partitionKey: string;
  timestampUtc: DateTime;
  properties: Record<string, unknown>;

  // UI only property
  preparedProperties: ObjectEntry<unknown>[];
}
