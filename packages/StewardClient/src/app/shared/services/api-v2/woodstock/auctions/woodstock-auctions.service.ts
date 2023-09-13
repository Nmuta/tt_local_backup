import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/woodstock/auctions endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockAuctionsService {
  public readonly basePath: string = 'title/woodstock/auctions';
  constructor(private readonly api: ApiV2Service) {}

  /** Create Single Auction. */
  public createSingleAuction$(
    carId: BigNumber,
    openingPrice: number,
    buyoutPrice: number,
    durationInMS: number,
    sellerId: BigNumber,
  ): Observable<string> {
    let params = new HttpParams();

    params = params.set('carId', carId.toString());
    params = params.set('openingPrice', openingPrice);
    params = params.set('buyoutPrice', buyoutPrice);
    params = params.set('durationInMS', durationInMS);
    params = params.set('sellerId', sellerId.toString());

    return this.api.postRequest$<string>(`${this.basePath}/createSingle`, undefined, params);
  }

  /** Create Bulk Auction. */
  public createBulkAuction$(
    sellerId: BigNumber,
    oneOfEveryCar: boolean,
    numberOfRandomCars: number,
    durationInMinutes: number,
  ): Observable<string[]> {
    let params = new HttpParams();
    params = params.set('sellerId', sellerId.toString());
    params = params.set('oneOfEveryCar', oneOfEveryCar);
    params = params.set('numberOfRandomCars', numberOfRandomCars);
    params = params.set('durationInMinutes', durationInMinutes);

    return this.api.postRequest$<string[]>(`${this.basePath}/createBulk`, undefined, params);
  }

  /** Gets auction blocklist. */
  public getAuctionBlocklist$(releaseIndex: number): Observable<AuctionBlocklistEntry[]> {
    let params = new HttpParams();
    params = params.set('currentReleaseIndex', releaseIndex);

    return this.api.getRequest$<AuctionBlocklistEntry[]>(`${this.basePath}/blocklist`, params);
  }
}
