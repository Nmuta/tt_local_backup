import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

/** Represents a PlayFab currency voucher. */
export interface PlayFabVoucher {
  id: string;
  contentType: string;
  title: Map<string, string>;
  description: Map<string, string>;
  startDate?: DateTime;
  endDate?: DateTime;
  type: string;
}

/** The /v2/woodstock/playfab/vouchers endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayFabVouchersService {
  public readonly basePath: string = 'title/woodstock/playfab/vouchers';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets PlayFab multiplayer server vouchers. */
  public getVouchers$(): Observable<PlayFabVoucher[]> {
    return this.api.getRequest$<PlayFabVoucher[]>(`${this.basePath}`);
  }
}
