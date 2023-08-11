import { Injectable } from '@angular/core';
import { PlayFabVoucher } from '@models/playfab';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

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
