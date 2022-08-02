import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ReportWeightType, UserReportWeight } from '@models/report-weight';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { keys } from 'lodash';
import { Observable, takeUntil } from 'rxjs';
import { hasAccessToRestrictedFeature, RestrictedFeature } from '@environments/environment';
import { Store } from '@ngxs/store';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';

export interface ReportWeightServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;

  /** Gets a player's report weight. */
  getUserReportWeight$(xuid: BigNumber): Observable<UserReportWeight>;

  /** Gets a player's report weight. */
  setUserReportWeight$(
    xuid: BigNumber,
    reportWeight: ReportWeightType,
  ): Observable<UserReportWeight>;
}

/** Component to get and set a player's report weight. */
@Component({
  selector: 'report-weight',
  templateUrl: './report-weight.component.html',
  styleUrls: ['./report-weight.component.scss'],
})
export class ReportWeightComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() service: ReportWeightServiceContract;
  @Input() xuid: BigNumber;

  public ReportWeightType = ReportWeightType;
  public currentReportWeight: UserReportWeight;
  public reportWeightTypes = keys(ReportWeightType).map(x => ReportWeightType[x]);
  public formControls = {
    reportWeightType: new FormControl(ReportWeightType.Default, Validators.required),
  };

  public getMonitor = new ActionMonitor('Get player report weight');
  public postMonitor = new ActionMonitor('Set player report weight');

  public canSetReportWeight: boolean = false;
  public featureDisabledText = `Feature is not supported for your user role`;

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** The selected report weight in form control.. */
  public get selectedReportWeight(): ReportWeightType {
    return this.formControls.reportWeightType.value;
  }

  /** Returns if report weight is different from active one set on player.. */
  public get hasChanges(): boolean {
    return this.selectedReportWeight !== this.currentReportWeight?.type;
  }

  constructor(protected readonly store: Store) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for report weight component.');
    }

    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.canSetReportWeight = hasAccessToRestrictedFeature(
      RestrictedFeature.SetReportWeight,
      this.gameTitle,
      user.role,
    );
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.xuid) {
      this.getMonitor = this.getMonitor.repeat();
      this.service
        .getUserReportWeight$(this.xuid)
        .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(reportWeight => {
          this.currentReportWeight = reportWeight;
          this.formControls.reportWeightType.setValue(reportWeight.type);
        });
    }
  }

  /** Sets a new report weight to the player XUID. */
  public setReportWeight(): void {
    if (!this.xuid || this.xuid.isNaN()) {
      return;
    }

    this.postMonitor = this.postMonitor.repeat();
    this.service
      .setUserReportWeight$(this.xuid, this.selectedReportWeight)
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(updatedReportWeight => {
        this.currentReportWeight = updatedReportWeight;
        this.formControls.reportWeightType.setValue(updatedReportWeight.type);
      });
  }
}
