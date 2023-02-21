import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle, PegasusEnvironment } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { keys } from 'lodash';
import { Observable, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PlayerCmsOverride } from '@models/player-cms-override.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { BetterSimpleChanges } from '@helpers/simple-changes';

export interface CmsOverrideServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;

  /** Gets a player's cms override. */
  getUserCmsOverride$(xuid: BigNumber): Observable<PlayerCmsOverride>;

  /** Gets a player's cms override. */
  setUserCmsOverride$(xuid: BigNumber, cmsOverride: PlayerCmsOverride): Observable<void>;
}

/** Component to get and set a player's cms override. */
@Component({
  selector: 'cms-override',
  templateUrl: './cms-override.component.html',
  styleUrls: ['./cms-override.component.scss'],
})
export class CmsOverrideComponent extends BaseComponent implements OnInit, OnChanges {
  @ViewChild(MatCheckbox) verifyCheckbox: MatCheckbox;

  /** The cms override service. */
  @Input() service: CmsOverrideServiceContract;
  /** Player xuid. */
  @Input() xuid: BigNumber;

  public pegasusEnvironment = PegasusEnvironment;
  public currentCmsOverride: PlayerCmsOverride;
  public cmsEnvironments = keys(PegasusEnvironment).map(x => PegasusEnvironment[x]);

  public formControls = {
    environment: new FormControl(''),
    snapshot: new FormControl(''),
    slot: new FormControl(''),
  };

  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get player cms override');
  public postMonitor = new ActionMonitor('Set player cms override');

  public readonly permAttribute = PermAttributeName.OverrideCms;

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  constructor(protected readonly store: Store) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for cms override component.');
    }
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<CmsOverrideComponent>): void {
    if (!!changes.xuid) {
      this.getMonitor = this.getMonitor.repeat();
      this.service
        .getUserCmsOverride$(this.xuid)
        .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(cmsOverride => {
          this.formControls.environment.setValue(cmsOverride.environment);
          this.formControls.slot.setValue(cmsOverride.slot);
          this.formControls.snapshot.setValue(cmsOverride.snapshot);
        });
    }
  }

  /** Sets a cms override for the player. */
  public setCmsOverride(): void {
    if (!this.xuid || this.xuid.isNaN()) {
      return;
    }

    const cmsOverride = {
      environment: this.formControls.environment.value,
      slot: this.formControls.slot.value,
      snapshot: this.formControls.snapshot.value,
    } as PlayerCmsOverride;

    this.postMonitor = this.postMonitor.repeat();
    this.service
      .setUserCmsOverride$(this.xuid, cmsOverride)
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.verifyCheckbox.checked = false;
      });
  }
}