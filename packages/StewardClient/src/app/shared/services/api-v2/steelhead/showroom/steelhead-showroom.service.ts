import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PegasusPathInfo } from '@models/pegasus-path-info';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

/** Interface that represents a Car Featured Showcase. */
export interface CarFeaturedShowcase {
  title: string;
  description: string;
  startTimeUtc: DateTime;
  endTimeUtc: DateTime;
  baseCost: number;
  carId: number;
  modelShort: string;
  mediaName: string;
  salePercentOff: number;
  salePrice: number;
  vipSalePercentOff: number;
  vipSalePrice: number;
}

/** Interface that represents a Division Featured Showcase. */
export interface DivisionFeaturedShowcase {
  title: string;
  description: string;
  startTimeUtc: DateTime;
  endTimeUtc: DateTime;
  divisionId: number;
  divisionName: string;
}

/** Interface that represents a Manufacturer Featured Showcase. */
export interface ManufacturerFeaturedShowcase {
  title: string;
  description: string;
  startTimeUtc: DateTime;
  endTimeUtc: DateTime;
  manufacturerId: number;
  manufacturerName: string;
}

/** Interface that represents a car price information. */
export interface CarPriceInformation {
  salePercentOff: number;
  salePrice: number;
  vipSalePercentOff: number;
  vipSalePrice: number;
  baseCost: number;
  mediaName: string;
  modelShort: string;
  carId: number;
}

/** Interface that represents a car sale. */
export interface CarSale {
  name: string;
  startTimeUtc: DateTime;
  endTimeUtc: DateTime;
  cars: CarPriceInformation[];
  carSaleId: string;
}

/** The /v2/title/steelhead/showroom endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadShowroomService {
  public readonly basePath: string = 'title/steelhead/showroom';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Showroom Car Feature Showcase. */
  public getCarFeaturedShowcasesByPegasus$(
    info: PegasusPathInfo,
  ): Observable<CarFeaturedShowcase[]> {
    let httpParams = new HttpParams();

    if (info?.environment) {
      httpParams = httpParams.append('environment', info.environment);
    }

    if (info?.slot) {
      httpParams = httpParams.append('slot', info.slot);
    }

    if (info?.snapshot) {
      httpParams = httpParams.append('snapshot', info.snapshot);
    }

    return this.api.getRequest$<CarFeaturedShowcase[]>(`${this.basePath}/carFeatured`, httpParams);
  }

  /** Gets Showroom Car Feature Showcase. */
  public getCarFeaturedShowcasesByUser$(xuid: BigNumber): Observable<CarFeaturedShowcase[]> {
    return this.api.getRequest$<CarFeaturedShowcase[]>(
      `${this.basePath}/player/${xuid}/carFeatured`,
    );
  }

  /** Gets Showroom Division Feature Showcase. */
  public getDivisionFeaturedShowcasesByPegasus$(
    info: PegasusPathInfo,
  ): Observable<DivisionFeaturedShowcase[]> {
    let httpParams = new HttpParams();

    if (info?.environment) {
      httpParams = httpParams.append('environment', info.environment);
    }

    if (info?.slot) {
      httpParams = httpParams.append('slot', info.slot);
    }

    if (info?.snapshot) {
      httpParams = httpParams.append('snapshot', info.snapshot);
    }

    return this.api.getRequest$<DivisionFeaturedShowcase[]>(
      `${this.basePath}/divisionFeatured`,
      httpParams,
    );
  }

  /** Gets Showroom Division Feature Showcase. */
  public getDivisionFeaturedShowcasesByUser$(
    xuid: BigNumber,
  ): Observable<DivisionFeaturedShowcase[]> {
    return this.api.getRequest$<DivisionFeaturedShowcase[]>(
      `${this.basePath}/player/${xuid}/divisionFeatured`,
    );
  }

  /** Gets Showroom Manufacturer Feature Showcase. */
  public getManufacturerFeaturedShowcasesByPegasus$(
    info: PegasusPathInfo,
  ): Observable<ManufacturerFeaturedShowcase[]> {
    let httpParams = new HttpParams();

    if (info?.environment) {
      httpParams = httpParams.append('environment', info.environment);
    }

    if (info?.slot) {
      httpParams = httpParams.append('slot', info.slot);
    }

    if (info?.snapshot) {
      httpParams = httpParams.append('snapshot', info.snapshot);
    }

    return this.api.getRequest$<ManufacturerFeaturedShowcase[]>(
      `${this.basePath}/manufacturerFeatured`,
      httpParams,
    );
  }

  /** Gets Showroom Manufacturer Feature Showcase. */
  public getManufacturerFeaturedShowcasesByUser$(
    xuid: BigNumber,
  ): Observable<ManufacturerFeaturedShowcase[]> {
    return this.api.getRequest$<ManufacturerFeaturedShowcase[]>(
      `${this.basePath}/player/${xuid}/manufacturerFeatured`,
    );
  }

  /** Gets Showroom Car Sales. */
  public getCarSales$(): Observable<CarSale[]> {
    return this.api.getRequest$<CarSale[]>(`${this.basePath}/carSales`);
  }

  /** Gets Showroom Car Sales. */
  public getCarSalesByPegasus$(info: PegasusPathInfo): Observable<CarSale[]> {
    let httpParams = new HttpParams();

    if (info?.environment) {
      httpParams = httpParams.append('environment', info.environment);
    }

    if (info?.slot) {
      httpParams = httpParams.append('slot', info.slot);
    }

    if (info?.snapshot) {
      httpParams = httpParams.append('snapshot', info.snapshot);
    }

    return this.api.getRequest$<CarSale[]>(`${this.basePath}/carSales`, httpParams);
  }

  /** Gets Showroom Car Sales. */
  public getCarSalesByUser$(xuid: BigNumber): Observable<CarSale[]> {
    return this.api.getRequest$<CarSale[]>(`${this.basePath}/player/${xuid}/carSales`);
  }
}
