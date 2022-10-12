import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetailedCar, SimpleCar } from '@models/cars';
import { PegasusProjectionSlot } from '@models/enums';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/woodstock/cars endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockCarsService {
  public readonly basePath: string = 'title/woodstock/cars';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Woodstock detailed car list. */
  public getCars$(pegasusSlotId?: PegasusProjectionSlot): Observable<SimpleCar[]> {
    let params = new HttpParams();
    if (!!pegasusSlotId) {
      params = params.set('slotId', pegasusSlotId);
    }

    return this.api.getRequest$<SimpleCar[]>(this.basePath, params);
  }

  /** Gets the Woodstock detailed car list. */
  public getCar$(carId: BigNumber, pegasusSlotId?: PegasusProjectionSlot): Observable<DetailedCar> {
    let params = new HttpParams();
    if (!!pegasusSlotId) {
      params = params.set('slotId', pegasusSlotId);
    }

    return this.api.getRequest$<DetailedCar>(`${this.basePath}/${carId.toString()}`, params);
  }
}
