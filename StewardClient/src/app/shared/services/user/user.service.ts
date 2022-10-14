import { Injectable } from '@angular/core';
import { BulkStewardUserLookup } from '@models/bulk-steward-user-lookup';
import { GameTitle } from '@models/enums';
import { UserModel } from '@models/user.model';
import { PermAttribute, PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ApiService } from '@shared/services/api';
import { Observable, of } from 'rxjs';

/** Defines the User Service. */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  public basePath: string = 'v1';

  constructor(private apiService: ApiService) {}

  /** Sends request to get the user profile. */
  public getUserProfile$(): Observable<UserModel> {
    return this.apiService.getRequest$<UserModel>(`${this.basePath}/me`);
  }

  /** Gets the user perm attributes. */
  public getUserAttributes$(): Observable<PermAttribute[]> {
    return of([
      {
        attribute: PermAttributeName.AdminFeature,
        title: GameTitle.FH5,
        environment: 'Retail',
      },
      {
        attribute: PermAttributeName.AdminFeature,
        title: GameTitle.FH5,
        environment: 'Studio',
      },
      {
        attribute: PermAttributeName.BanPlayer,
        title: GameTitle.FH5,
        environment: 'Retail',
      },
    ]);
    // This isnt built yet, waiting on API work to go in
    // return this.apiService.getRequest$<PermAttribute[]>(`${this.basePath}/me/attributes`);
  }

  /** Sends request to get Steward user data. */
  public getStewardUsers$(bulkLookup: BulkStewardUserLookup): Observable<UserModel[]> {
    return this.apiService.postRequest$<UserModel[]>(`${this.basePath}/users`, bulkLookup);
  }
}
