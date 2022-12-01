import { Injectable } from '@angular/core';
import { BulkStewardUserLookup } from '@models/bulk-steward-user-lookup';
import { UserModel, UserModelWithPermissions } from '@models/user.model';
import { ApiService } from '@shared/services/api';
import { Observable } from 'rxjs';

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

  /** Sends request to get Steward user data. */
  public getStewardUsers$(bulkLookup: BulkStewardUserLookup): Observable<UserModel[]> {
    return this.apiService.postRequest$<UserModel[]>(`${this.basePath}/users`, bulkLookup);
  }

  /** Gets all Steward users. */
  public getAllStewardUsers$(): Observable<UserModelWithPermissions[]> {
    return this.apiService.getRequest$<UserModelWithPermissions[]>(`${this.basePath}/allUsers`);
  }
}
