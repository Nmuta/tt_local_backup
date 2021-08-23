import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { Select } from '@ngxs/store';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { camelCase } from 'lodash';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Component for displaying user endpoint selections. */
@Component({
  selector: 'endpoint-selection',
  templateUrl: './endpoint-selection.component.html',
  styleUrls: ['./endpoint-selection.component.scss'],
})
export class EndpointSelectionComponent extends BaseComponent implements OnInit {
  @Input() public titleCodeName: GameTitleCodeName;
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  public displayEndpointName: string;
  private readonly retailEndpointName: string = 'Retail';

  constructor() {
    super();
  }

  /** Initialization hook. */
  ngOnInit(): void {
    this.settings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      const stateKey = `${camelCase(this.titleCodeName)?.toLowerCase()}EndpointKey`;

      let displayName = latest[stateKey];
      displayName ??= '';

      this.displayEndpointName = displayName != this.retailEndpointName ? displayName : '';
    });
  }
}
