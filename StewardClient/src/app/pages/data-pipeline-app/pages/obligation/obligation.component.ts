import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { replace } from '@helpers/replace';
import { ObligationKustoRestateOMaticDataActivity } from '@models/pipelines/obligation-kusto-restate-o-matic-data-activity';
import { ObligationPrincipal } from '@models/pipelines/obligation-principal';
import { SimplifiedObligationPipeline } from '@models/pipelines/simplified-obligation-pipeline';
import { ObligationsService } from '@services/obligations';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { VerifyWithButtonDirective } from '@shared/modules/verify/verify-with.directive';
import BigNumber from 'bignumber.js';
import { chain, cloneDeep, flatMap, has, keyBy } from 'lodash';
import { DateTime } from 'luxon';
import moment from 'moment';
import { of } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import {
  FullObligationInputComponent,
  ObligationOptions,
} from './components/full-obligation-input/full-obligation-input.component';
import { KustoDataActivityOptions } from './components/kusto-data-activities/kusto-data-activity/kusto-data-activity.component';
import { KustoRestateOMaticDataActivityOptions } from './components/kusto-data-activities/restate-o-matic/restate-o-matic.component';
import { ObligationPrincipalOptions } from './components/obligation-principals/obligation-principals.component';
import { ActivePipelineService } from './services/active-pipeline.service';

/** Displays the community messaging feature. */
@Component({
  templateUrl: './obligation.component.html',
  styleUrls: ['./obligation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivePipelineService],
})
export class DataPipelineObligationComponent extends BaseComponent implements AfterViewChecked {
  @ViewChildren(VerifyWithButtonDirective) private checkboxes: VerifyWithButtonDirective[] = [];
  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public putMonitor: ActionMonitor = new ActionMonitor('PUT');
  public createMonitor: ActionMonitor = new ActionMonitor('POST (create)');
  public postMonitor: ActionMonitor = new ActionMonitor('POST');
  public deleteMonitor: ActionMonitor = new ActionMonitor('DELETE');
  public allMonitors = [
    this.getMonitor,
    this.putMonitor,
    this.postMonitor,
    this.createMonitor,
    this.deleteMonitor,
  ];

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
    private readonly activePipeline: ActivePipelineService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngAfterViewChecked(): void {
    // the extra change detection cycles get this component in sync with the child components before render, even if new errors were generated by the children
    this.changeDetectorRef.detectChanges();
  }

  /** Called when the GET button is clicked. */
  public onGetClick(): void {
    this.getMonitor = this.updateMonitors(this.getMonitor);

    // forces update of auto-complete options, etc
    this.activePipeline.onSync$.next();

    this.obligationsService
      .get$(this.options.name)
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
        this.setValue(mapped);
        this.changeDetectorRef.markForCheck();
        this.clearVerificationCheckboxes();
      });
  }

  /** Called when the PUT button is clicked. */
  public onPutClick(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.putMonitor = this.updateMonitors(this.putMonitor);

    this.obligationsService
      .put$(this.obligationOptionsToApiObligation(this.options))
      .pipe(takeUntil(this.onDestroy$), this.putMonitor.monitorSingleFire())
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

    this.postMonitor = this.updateMonitors(this.postMonitor);
    this.obligationsService
      .post$(this.obligationOptionsToApiObligation(this.options))
      .pipe(takeUntil(this.onDestroy$), this.postMonitor.monitorSingleFire())
      .subscribe(_model => {
        this.clearVerificationCheckboxes();
        this.onGetClick();
      });
  }

  /** Called when the Create button is clicked. */
  public onCreateClick(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.createMonitor = this.updateMonitors(this.createMonitor);
    this.obligationsService
      .create$(this.obligationOptionsToApiObligation(this.options))
      .pipe(takeUntil(this.onDestroy$), this.createMonitor.monitorSingleFire())
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

    this.deleteMonitor = this.updateMonitors(this.deleteMonitor);

    this.obligationsService
      .delete$(this.options.name)
      .pipe(takeUntil(this.onDestroy$), this.deleteMonitor.monitorSingleFire())
      .subscribe(_model => {
        this.clearVerificationCheckboxes();
        this.setValue(cloneDeep(FullObligationInputComponent.defaults));
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

      obligationPipelines: options.dataActivities.map(bundle => {
        const activity = bundle.dataActivity;
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
      obligationRestateOMatics: flatMap(options.dataActivities, bundle => {
        const activity = bundle.restateOMatic;
        if (!activity) {
          return [];
        }
        return [
          <ObligationKustoRestateOMaticDataActivity>{
            activityName: activity.name,
            kustoDatabase: activity.database,
            kustoTableName: activity.table,
            targetDataActivity: bundle.dataActivity.name,
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
            includeChildren: activity.includeChildren,
          },
        ];
      }),
    };
  }

  private apiObligationToObligationOptions(model: SimplifiedObligationPipeline): ObligationOptions {
    const kustoDataActivities = model.obligationPipelines;
    const restateOMaticLookup = keyBy(
      model.obligationRestateOMatics,
      activity => activity.targetDataActivity,
    );
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
      dataActivities: kustoDataActivities.map(pipeline => {
        const dataActivity = <KustoDataActivityOptions>{
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

        let restateOMatic: KustoRestateOMaticDataActivityOptions = null;
        if (has(restateOMaticLookup, pipeline.activityName)) {
          const restateOMaticActivity = restateOMaticLookup[pipeline.activityName];
          restateOMatic = {
            name: restateOMaticActivity.activityName,
            table: restateOMaticActivity.kustoTableName,
            database: restateOMaticActivity.destinationDatabase,
            dependencyNames: restateOMaticActivity.dataActivityDependencyNames,
            dateRange: {
              start: DateTime.fromJSDate(restateOMaticActivity.startDateUtc).toUTC(),
              end: DateTime.fromJSDate(restateOMaticActivity.endDateUtc).toUTC(),
            },
            executionDelayInMinutes: moment
              .duration(restateOMaticActivity.executionDelay)
              .asMinutes(),
            executionIntervalInMinutes: moment
              .duration(restateOMaticActivity.executionInterval)
              .asMinutes(),
            maximumExecutionTimeInMinutes: moment
              .duration(restateOMaticActivity.maxExecutionSpan)
              .asMinutes(),
            parallelismLimit: restateOMaticActivity.parallelismLimit.toNumber(),
            query: {
              name: restateOMaticActivity.kustoFunction.name,
              useEndDate: restateOMaticActivity.kustoFunction.useEndDate,
              useSplitting: restateOMaticActivity.kustoFunction.useSplitting,
              numberOfBuckets: restateOMaticActivity.kustoFunction.numberOfBuckets,
            },
            includeChildren: restateOMaticActivity.includeChildren,
          };
        }

        return {
          restateOMatic,
          dataActivity,
        };
      }),
    };
  }

  /** Sets the value for the form. */
  private setValue(options: ObligationOptions): void {
    this.formControls.options.setValue(options);
    this.activePipeline.activityNames = chain(this.options.dataActivities)
      .map(da => [da.dataActivity?.name, da.restateOMatic?.name])
      .flatten()
      .filter(v => !!v)
      .value();
  }

  /** Recreates the given action monitor, replacing it in the allMonitors list. */
  private updateMonitors(oldMonitor: ActionMonitor): ActionMonitor {
    oldMonitor.dispose();
    const newMonitor = new ActionMonitor(oldMonitor.label);
    this.allMonitors = replace(this.allMonitors, oldMonitor, newMonitor);
    return newMonitor;
  }
}
