import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import BigNumber from 'bignumber.js';
import { Observable, of } from 'rxjs';
import { CreateUserGroupServiceContract } from '../create-user-group.component';

/** Tool that creates new user groups. */
@Component({
  selector: 'sunrise-create-user-group',
  templateUrl: './sunrise-create-user-group.component.html',
  styleUrls: ['./sunrise-create-user-group.component.scss'],
})
export class SunriseCreateUserGroupComponent extends BaseComponent {
  /** Outputs when a new user group is created */
  @Output() newUserGroup = new EventEmitter<LspGroup>();

  public service: CreateUserGroupServiceContract = {
    gameTitle: GameTitle.FH4,
    createUserGroup$(groupName: string): Observable<LspGroup> {
      return of({ name: groupName, id: new BigNumber(1) });
    },
  };
}
