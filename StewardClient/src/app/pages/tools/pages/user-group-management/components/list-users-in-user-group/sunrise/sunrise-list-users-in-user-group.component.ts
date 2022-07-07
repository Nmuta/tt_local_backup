import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import faker from '@faker-js/faker';
import { LspGroup } from '@models/lsp-group';
import BigNumber from 'bignumber.js';
import { Observable, of } from 'rxjs';
import {
  ListUsersInGroupServiceContract,
  PlayerInUserGroup,
} from '../list-users-in-user-group.component';

/** Tool that creates new user groups. */
@Component({
  selector: 'sunrise-list-users-in-user-group',
  templateUrl: './sunrise-list-users-in-user-group.component.html',
  styleUrls: ['./sunrise-list-users-in-user-group.component.scss'],
})
export class SunriseListUsersInGroupComponent extends BaseComponent {
  /** User group to list users and manage. */
  @Input() userGroup: LspGroup;

  public service: ListUsersInGroupServiceContract = {
    getPlayersInUserGroup$(_userGroup: LspGroup): Observable<PlayerInUserGroup[]> {
      return of(
        new Array(100).fill(null).map(() => {
          return {
            gamertag: faker.random.words(2),
            xuid: new BigNumber(faker.datatype.number()),
          };
        }),
      );
    },
    deletePlayerFromUserGroup$(_xuid: BigNumber, _userGroup: LspGroup): Observable<boolean> {
      return of(true);
    },
    deleteAllPlayersFromUserGroup$(_userGroup: LspGroup): Observable<boolean> {
      return of(true);
    },
  };
}
