import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { overrideWoodstockEndpointKey } from '@helpers/override-endpoint-key';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/usergroup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockLeaderboardTalentService {
  private basePath: string = 'title/woodstock/leaderboard/talent';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets leaderboard talent identities from Retail. Talent identities are not in Studio. */
  public getRetailLeaderboardTalentIdentities$(): Observable<IdentityResultAlphaBatch> {
    let headers = new HttpHeaders();
    headers = overrideWoodstockEndpointKey('Retail', headers);
    return this.api.getRequest$<IdentityResultAlphaBatch>(`${this.basePath}`, undefined, headers);
  }
}
