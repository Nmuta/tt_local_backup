import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { BetterSimpleChanges } from '@helpers/simple-changes';

/** Driver level service contract. */
export interface DriverLevelServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
}

/** Component to get and set a player's cms override. */
@Component({
  selector: 'driver-level',
  templateUrl: './driver-level.component.html',
  styleUrls: ['./driver-level.component.scss'],
})
export class DriverLevelComponent extends BaseComponent implements OnChanges {
  /** Driver level service contrtact. */
  @Input() service: DriverLevelServiceContract;
  /** Player xuid. */
  @Input() xuid: BigNumber;

  public formControls = {
    input1: new FormControl(''),
  };

  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get driver level');

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  constructor() {
    super();
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<DriverLevelComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for driver level component.');
    }

    if (!!changes.xuid) {
      // Do stuff here
    }
  }
}
