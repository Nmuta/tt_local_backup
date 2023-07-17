import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
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
}

/** The /v2/title/steelhead/showroom endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadShowroomService {
  public readonly basePath: string = 'title/steelhead/showroom';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Showroom Car Feature Showcase. */
  public getCarFeaturedShowcases$(): Observable<CarFeaturedShowcase[]> {
    return this.api.getRequest$<CarFeaturedShowcase[]>(`${this.basePath}/carFeatured`);
  }

  /** Gets Showroom Division Feature Showcase. */
  public getDivisionFeaturedShowcases$(): Observable<DivisionFeaturedShowcase[]> {
    return this.api.getRequest$<DivisionFeaturedShowcase[]>(`${this.basePath}/divisionFeatured`);
  }

  /** Gets Showroom Manufacturer Feature Showcase. */
  public getManufacturerFeaturedShowcases$(): Observable<ManufacturerFeaturedShowcase[]> {
    return this.api.getRequest$<ManufacturerFeaturedShowcase[]>(
      `${this.basePath}/manufacturerFeatured`,
    );
  }

  /** Gets Showroom Car Sales. */
  public getCarSales$(): Observable<CarSale[]> {
    return this.api.getRequest$<CarSale[]>(`${this.basePath}/carSales`);
  }
}
