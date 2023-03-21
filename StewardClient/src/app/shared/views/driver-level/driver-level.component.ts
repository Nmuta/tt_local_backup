import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { Observable, takeUntil } from 'rxjs';
import { PlayerDriverLevel } from '@models/player-driver-level.model';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';

/** Driver level service contract. */
export interface DriverLevelServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  getDriverLevel$(xuid: BigNumber): Observable<PlayerDriverLevel>;
  setDriverLevel$(xuid: BigNumber, driverLevel: PlayerDriverLevel): Observable<PlayerDriverLevel>;
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
    driverLevel: new FormControl('', [Validators.required, Validators.min(1), Validators.max(999)]),
    prestigeRank: new FormControl('', [Validators.required, Validators.min(0), Validators.max(9)]),
    experiencePoints: new FormControl({ value: '', disabled: true }, Validators.required),
  };

  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get driver level');

  public setMonitor = new ActionMonitor('Set driver level');

  public permAttribute = PermAttributeName.SetDriverLevel;

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
      this.getMonitor = this.setMonitor.repeat();

      this.service
        .getDriverLevel$(this.xuid)
        .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(driverLevel => {
          this.formGroup.setValue(driverLevel);
        });
    }
  }

  /** Sets a driver's level. */
  public setDriverLevel(): void {
    this.setMonitor = this.setMonitor.repeat();

    this.service
      .setDriverLevel$(this.xuid, this.formGroup.value)
      .pipe(this.setMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(driverLevel => {
        this.formGroup.setValue(driverLevel);
      });
  }
}
