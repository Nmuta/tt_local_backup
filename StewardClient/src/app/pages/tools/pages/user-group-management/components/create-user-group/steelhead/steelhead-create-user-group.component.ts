import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { LspGroup } from '@models/lsp-group';
import BigNumber from 'bignumber.js';
import { Observable, of } from 'rxjs';
import { CreateUserGroupServiceContract } from '../create-user-group.component';

/** Tool that creates new user groups. */
@Component({
  selector: 'steelhead-create-user-group',
  templateUrl: './steelhead-create-user-group.component.html',
  styleUrls: ['./steelhead-create-user-group.component.scss'],
})
export class SteelheadCreateUserGroupComponent extends BaseComponent {
  /** Outputs when a new user group is created */
  @Output() newUserGroup = new EventEmitter<LspGroup>();

  public service: CreateUserGroupServiceContract = {
    createUserGroup$(groupName: string): Observable<LspGroup> {
      return of({ name: groupName, id: new BigNumber(1) });
    },
  };
}
