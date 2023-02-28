import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { UserModel } from '@models/user.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { StewardTeam } from '@tools-app/pages/permission-management/permission-management.models';
import { Observable, of, tap } from 'rxjs';

/** The /v2/users endpoints. */
@Injectable({
  providedIn: 'root',
})
export class V2UsersService {
  public readonly basePath: string = 'users';
  private teamLead: UserModel;

  constructor(private readonly api: ApiV2Service) {}

  /** Syncs AAD users with DB users. */
  public syncDb$(): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/sync`, undefined);
  }

  /** Gets all Steward teams. */
  public getStewardTeams$(): Observable<Map<GuidLikeString, StewardTeam>> {
    return this.api.getRequest$<Map<GuidLikeString, StewardTeam>>(`${this.basePath}/teams`);
  }

  /** Gets Steward team. */
  public getStewardTeam$(teamLeadId: GuidLikeString): Observable<StewardTeam> {
    return this.api.getRequest$<StewardTeam>(`${this.basePath}/${teamLeadId}/team`);
  }

  /** Gets user's team lead. Null if they have none; */
  public getTeamLead$(userId: GuidLikeString): Observable<UserModel> {
    if (this.teamLead !== undefined) {
      return of(this.teamLead);
    }

    return this.api
      .getRequest$<UserModel>(`${this.basePath}/${userId}/teamLead`)
      .pipe(tap(teamLead => (this.teamLead = teamLead)));
  }

  /** Sets Steward team. */
  public setStewardTeam$(newTeam: StewardTeam): Observable<StewardTeam> {
    return this.api.postRequest$<StewardTeam>(
      `${this.basePath}/${newTeam.teamLead.objectId}/team`,
      newTeam,
    );
  }

  /** Deletes Steward team. */
  public deleteStewardTeam$(teamLeadId: GuidLikeString): Observable<void> {
    return this.api.deleteRequest$<void>(`${this.basePath}/${teamLeadId}/team`);
  }
}
