import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { UserModel } from '@models/user.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { PermAttribute, PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { Observable, of } from 'rxjs';

/** Key/value pairing of permission attribute name with supported game titles. */
export type PermissionAttributeList = { [key: string]: GameTitle[] };

/** The /v2/title/permissionss endpoints. */
@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  public readonly basePath: string = 'permissions';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Woodstock detailed car list. */
  public getAllPermissionAttributes$(): Observable<PermissionAttributeList> {
    return this.api.getRequest$<PermissionAttributeList>(this.basePath);
  }

  /** Gets the user perm attributes. */
  public getUserPermissionAttributes$(_user: UserModel): Observable<PermAttribute[]> {
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

    // return this.api.getRequest$<PermAttribute[]>(`${this.basePath}/user/${user.objectId}`);
  }

  /** Gets the user perm attributes. */
  public setUserPermissionAttributes$(
    user: UserModel,
    attributes: PermAttribute[],
  ): Observable<PermAttribute[]> {
    return this.api.postRequest$<PermAttribute[]>(
      `${this.basePath}/user/${user.objectId}`,
      attributes,
    );
  }
}
