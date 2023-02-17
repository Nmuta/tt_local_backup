import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { StewardTeam } from '@tools-app/pages/permission-management/permission-management.models';
import { Observable } from 'rxjs';

/** The /v2/users endpoints. */
@Injectable({
  providedIn: 'root',
})
export class V2UsersService {
  public readonly basePath: string = 'users';
  constructor(private readonly api: ApiV2Service) {}

  /** Syncs AAD users with DB users. */
  public syncDb$(): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/sync`, undefined);
  }

  /** Creates a new Steward team. */
  public createNewStewardTeam$(newTeam: StewardTeam): Observable<StewardTeam> {
    console.log(newTeam)
    return this.api.postRequest$<StewardTeam>(`${this.basePath}/${newTeam.teamLeadId}/team`, newTeam);
  }
}
