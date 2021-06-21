import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { toDuration } from '@helpers/luxon';
import { replace } from '@helpers/replace';
import { ObligationKustoRestateOMaticDataActivity } from '@models/pipelines/obligation-kusto-restate-o-matic-data-activity';
import { ObligationPrincipal } from '@models/pipelines/obligation-principal';
import { SimplifiedObligationPipeline } from '@models/pipelines/simplified-obligation-pipeline';
import { ObligationsService } from '@services/obligations';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { VerifyWithButtonDirective } from '@shared/modules/verify/verify-with.directive';
import BigNumber from 'bignumber.js';
import { chain, cloneDeep, flatMap, has, keyBy } from 'lodash';
import { Duration } from 'luxon';
import { of } from 'rxjs';
import { catchError, delay, map, takeUntil } from 'rxjs/operators';
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
  selector: 'hook-to-test-obligation-page',
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
      .pipe(takeUntil(this.onDestroy$), delay(5_000 /*ms*/), this.putMonitor.monitorSingleFire())
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
      .pipe(takeUntil(this.onDestroy$), delay(5_000 /*ms*/), this.postMonitor.monitorSingleFire())
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
      .pipe(takeUntil(this.onDestroy$), delay(5_000 /*ms*/), this.createMonitor.monitorSingleFire())
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

      kustoDataActivities: options.dataActivities.map(bundle => {
        const activity = bundle.dataActivity;
        return {
          activityName: activity.name,
          kustoTableName: activity.table,
          destinationDatabase: activity.database,
          startDateUtc: activity.dateRange.start.toUTC(),
          endDateUtc: activity.dateRange.end.toUTC(),
          executionDelay: Duration.fromObject({ minutes: activity.executionDelayInMinutes }),
          executionInterval: Duration.fromObject({ minutes: activity.executionIntervalInMinutes }),
          maxExecutionSpan: Duration.fromObject({
            minutes: activity.maximumExecutionTimeInMinutes,
          }),
          parallelismLimit: new BigNumber(activity.parallelismLimit),
          kustoFunction: {
            name: activity.query.name,
            makeFunctionCall: activity.query.makeFunctionCall,
            useEndDate: activity.query.useEndDate,
            useSplitting: activity.query.useSplitting,
            numberOfBuckets: activity.query.numberOfBuckets
              ? new BigNumber(activity.query.numberOfBuckets)
              : null,
          },
          dataActivityDependencyNames: activity.dependencyNames,
        };
      }),
      kustoRestateOMaticDataActivities: flatMap(options.dataActivities, bundle => {
        const activity = bundle.restateOMatic;
        if (!activity) {
          return [];
        }
        return [
          <ObligationKustoRestateOMaticDataActivity>{
            activityName: activity.name,
            kustoDatabase: activity.database,
            targetDataActivity: bundle.dataActivity.name,
            destinationDatabase: activity.database,
            startDateUtc: activity.dateRange.start.toUTC(),
            endDateUtc: activity.dateRange.end.toUTC(),
            executionDelay: Duration.fromObject({ minutes: activity.executionDelayInMinutes }),
            executionInterval: Duration.fromObject({
              minutes: activity.executionIntervalInMinutes,
            }),
            maxExecutionSpan: Duration.fromObject({
              minutes: activity.maximumExecutionTimeInMinutes,
            }),
            parallelismLimit: new BigNumber(activity.parallelismLimit),
            kustoFunction: {
              name: activity.query.name,
              makeFunctionCall: activity.query.makeFunctionCall,
              useEndDate: activity.query.useEndDate,
              useSplitting: activity.query.useSplitting,
              numberOfBuckets: activity.query.numberOfBuckets
                ? new BigNumber(activity.query.numberOfBuckets)
                : null,
            },
            dataActivityDependencyNames: activity.dependencyNames,
            includeChildren: activity.includeChildren,
          },
        ];
      }),
    };
  }

  private apiObligationToObligationOptions(model: SimplifiedObligationPipeline): ObligationOptions {
    const kustoDataActivities = model.kustoDataActivities;
    const restateOMaticLookup = keyBy(
      model.kustoRestateOMaticDataActivities,
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
            start: pipeline.startDateUtc.toUTC(),
            end: pipeline.endDateUtc.toUTC(),
          },
          executionDelayInMinutes: toDuration(pipeline.executionDelay).as('minutes'),
          executionIntervalInMinutes: toDuration(pipeline.executionInterval).as('minutes'),
          maximumExecutionTimeInMinutes: toDuration(pipeline.maxExecutionSpan).as('minutes'),
          parallelismLimit: pipeline.parallelismLimit.toNumber(),
          query: {
            name: pipeline.kustoFunction.name,
            makeFunctionCall: pipeline.kustoFunction.makeFunctionCall,
            useEndDate: pipeline.kustoFunction.useEndDate,
            useSplitting: pipeline.kustoFunction.useSplitting,
            numberOfBuckets: pipeline.kustoFunction.numberOfBuckets?.toNumber(),
          },
          fromApi: true,
        };

        let restateOMatic: KustoRestateOMaticDataActivityOptions = null;
        if (has(restateOMaticLookup, pipeline.activityName)) {
          const restateOMaticActivity = restateOMaticLookup[pipeline.activityName];
          restateOMatic = {
            name: restateOMaticActivity.activityName,
            database: restateOMaticActivity.destinationDatabase,
            dependencyNames: restateOMaticActivity.dataActivityDependencyNames,
            dateRange: {
              start: restateOMaticActivity.startDateUtc.toUTC(),
              end: restateOMaticActivity.endDateUtc.toUTC(),
            },
            executionDelayInMinutes: restateOMaticActivity.executionDelay.minutes,
            executionIntervalInMinutes: restateOMaticActivity.executionInterval.minutes,
            maximumExecutionTimeInMinutes: restateOMaticActivity.maxExecutionSpan.minutes,
            parallelismLimit: restateOMaticActivity.parallelismLimit.toNumber(),
            query: {
              name: restateOMaticActivity.kustoFunction.name,
              makeFunctionCall: restateOMaticActivity.kustoFunction.makeFunctionCall,
              useEndDate: restateOMaticActivity.kustoFunction.useEndDate,
              useSplitting: restateOMaticActivity.kustoFunction.useSplitting,
              numberOfBuckets: restateOMaticActivity.kustoFunction.numberOfBuckets?.toNumber(),
            },
            includeChildren: restateOMaticActivity.includeChildren,
            fromApi: true,
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
