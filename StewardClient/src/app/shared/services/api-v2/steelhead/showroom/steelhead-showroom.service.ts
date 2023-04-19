import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** Interface that represents a showroom car. */
export interface ShowroomCar {
  baseCost: number;
  carId: number;
  modelShort: string;
  mediaName: string;
}

/** Interface that represents a Car Featured Showcase. */
export interface CarFeaturedShowcase {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  car: ShowroomCar;
}

/** Interface that represents a car price information. */
export interface CarPriceInformation {
  salePercentOff: number;
  salePrice: number;
  vipSalePercentOff: number;
  vipSalePrice: number;
  car: ShowroomCar;
}

/** Interface that represents a car sale. */
export interface CarSale {
  name: string;
  startTime: string;
  endTime: string;
  cars: CarPriceInformation[];
}

/** Interface that represents a showroom car listing. */
export interface CarListing {
  carId: number;
  saleInformation: CarPriceInformation[];
  listPrice: number;
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

  /** Gets Showroom Car Sales. */
  public getCarSales$(): Observable<CarSale[]> {
    return this.api.getRequest$<CarSale[]>(`${this.basePath}/carSales`);
  }

  /** Gets Car Listing by car Id. */
  public getCarListing$(carId: number): Observable<CarListing> {
    return this.api.getRequest$<CarListing>(`${this.basePath}/carListing/${carId}`);
  }
}
