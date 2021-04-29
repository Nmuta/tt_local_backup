import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { ObligationPrincipal } from '@models/pipelines/obligation-principal';
import { SimplifiedObligationPipeline } from '@models/pipelines/simplified-obligation-pipeline';
import { ObligationsService } from '@services/obligations';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { VerifyWithButtonDirective } from '@shared/modules/verify/verify-with.directive';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import moment from 'moment';
import { of } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import {
  FullObligationInputComponent,
  ObligationOptions,
} from './components/full-obligation-input/full-obligation-input.component';
import { ObligationPrincipalOptions } from './components/obligation-principals/obligation-principals.component';

/** Displays the community messaging feature. */
@Component({
  templateUrl: './obligation.component.html',
  styleUrls: ['./obligation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPipelineObligationComponent extends BaseComponent {
  @ViewChildren(VerifyWithButtonDirective) private checkboxes: VerifyWithButtonDirective[] = [];
  public getMonitor: ActionMonitor = new ActionMonitor();

  public formControls = {
    options: new FormControl(cloneDeep(FullObligationInputComponent.defaults), [
      Validators.required,
    ]),
  };

  public formGroup = new FormGroup({
    options: this.formControls.options,
  });

  /** The options for this form. */
  public get options(): ObligationOptions {
    return this.formControls.options.value as ObligationOptions;
  }

  constructor(
    private readonly obligationsService: ObligationsService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  /** Called when the GET button is clicked. */
  public onGetClick(): void {
    this.getMonitor.dispose();
    this.getMonitor = new ActionMonitor('GET');
    this.obligationsService
      .get(this.options.name)
      .pipe(
        takeUntil(this.onDestroy$),
        this.getMonitor.monitorSingleFire(),
        map(model => this.apiObligationToObligationOptions(model)),
        catchError(() => {
          const newValue = cloneDeep(FullObligationInputComponent.defaults);
          newValue.name = this.options.name;
          return of(newValue);
        }),
      )
      .subscribe(mapped => {
        this.formControls.options.setValue(mapped);
        this.changeDetectorRef.markForCheck();
        this.clearVerificationCheckboxes();
      });
  }

  /** Called when the PUT button is clicked. */
  public onPutClick(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.obligationsService
      .put(this.obligationOptionsToApiObligation(this.options))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_model => {
        this.clearVerificationCheckboxes();
        this.onGetClick();
      });
  }

  /** Called when the POST button is clicked. */
  public onPostClick(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.obligationsService
      .post(this.obligationOptionsToApiObligation(this.options))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_model => {
        this.clearVerificationCheckboxes();
        this.onGetClick();
      });
  }

  /** Called when the DELETE button is clicked. */
  public onDeleteClick(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.obligationsService
      .delete(this.options.name)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_model => {
        this.clearVerificationCheckboxes();
        this.formControls.options.setValue(cloneDeep(FullObligationInputComponent.defaults));
        this.changeDetectorRef.markForCheck();
      });
  }

  private clearVerificationCheckboxes() {
    for (const checkbox of this.checkboxes) {
      checkbox.clear();
    }
  }

  private obligationOptionsToApiObligation(
    options: ObligationOptions,
  ): SimplifiedObligationPipeline {
    return {
      pipelineName: options.name,
      pipelineDescription: options.description,
      principals: options.principals.map(
        p =>
          <ObligationPrincipal>{
            principal_type: p.principalType,
            role: p.role,
            principal_value: p.principalValue,
          },
      ),
      obligationPipelines: options.dataActivities.map(activity => {
        return {
          activityName: activity.name,
          kustoTableName: activity.table,
          destinationDatabase: activity.database,
          startDateUtc: activity.dateRange.start.toUTC().toJSDate(),
          endDateUtc: activity.dateRange.end.toUTC().toJSDate(),
          executionDelay: moment.duration(activity.executionDelayInMinutes, 'minutes'),
          executionInterval: moment.duration(activity.executionIntervalInMinutes, 'minutes'),
          maxExecutionSpan: moment.duration(activity.maximumExecutionTimeInMinutes, 'minutes'),
          parallelismLimit: new BigNumber(activity.parallelismLimit),
          kustoFunction: {
            name: activity.query.name,
            useEndDate: activity.query.useEndDate,
            useSplitting: activity.query.useSplitting,
            numberOfBuckets: activity.query.numberOfBuckets,
          },
          dataActivityDependencyNames: activity.dependencyNames,
        };
      }),
    };
  }

  private apiObligationToObligationOptions(model: SimplifiedObligationPipeline): ObligationOptions {
    return {
      name: model.pipelineName,
      description: model.pipelineDescription,
      principals: model.principals.map(
        p =>
          <ObligationPrincipalOptions>{
            principalType: p.principal_type,
            role: p.role,
            principalValue: p.principal_value,
          },
      ),
      dataActivities: model.obligationPipelines.map(pipeline => {
        return {
          name: pipeline.activityName,
          table: pipeline.kustoTableName,
          database: pipeline.destinationDatabase,
          dependencyNames: pipeline.dataActivityDependencyNames,
          dateRange: {
            start: DateTime.fromJSDate(pipeline.startDateUtc).toUTC(),
            end: DateTime.fromJSDate(pipeline.endDateUtc).toUTC(),
          },
          executionDelayInMinutes: moment.duration(pipeline.executionDelay).asMinutes(),
          executionIntervalInMinutes: moment.duration(pipeline.executionInterval).asMinutes(),
          maximumExecutionTimeInMinutes: moment.duration(pipeline.maxExecutionSpan).asMinutes(),
          parallelismLimit: pipeline.parallelismLimit.toNumber(),
          query: {
            name: pipeline.kustoFunction.name,
            useEndDate: pipeline.kustoFunction.useEndDate,
            useSplitting: pipeline.kustoFunction.useSplitting,
            numberOfBuckets: pipeline.kustoFunction.numberOfBuckets,
          },
        };
      }),
    };
  }
}
