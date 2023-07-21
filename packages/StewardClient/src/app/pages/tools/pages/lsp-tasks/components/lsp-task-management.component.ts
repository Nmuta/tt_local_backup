import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { LspTask, LspTaskPeriodType, LspTaskState } from '@models/lsp-task';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { flatten } from 'lodash';
import { DateTime } from 'luxon';
import { Observable, takeUntil } from 'rxjs';

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupTaskEntry {
  formGroup: FormGroup;
  edit?: boolean;
  postMonitor: ActionMonitor;
  lspTask: LspTask;
}

/** Lsp tasks management contract. */
export interface LspTaskManagementContract {
  /** Get game title. */
  gameTitle: GameTitle;
  /** Get lsp tasks. */
  getLspTasks$(): Observable<LspTask[]>;
  /** Update a single lsp task. */
  updateLspTask$(task: LspTask): Observable<void>;
}

/** Displays the lsp tasks. */
@Component({
  selector: 'lsp-task-management',
  templateUrl: './lsp-task-management.component.html',
  styleUrls: ['./lsp-task-management.component.scss'],
})
export class LspTaskManagementComponent extends BaseComponent implements OnInit {
  /** The lsp task management service. */
  @Input() public service: LspTaskManagementContract;

  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public allMonitors = [this.getMonitor];
  public rawLspTasks: LspTask[];
  public lspTasks = new MatTableDataSource<FormGroupTaskEntry>();
  public columnsToDisplay = ['task-info', 'execution-info', 'actions'];
  public lspTaskPeriodTypes: LspTaskPeriodType[] = [
    LspTaskPeriodType.Deterministic,
    LspTaskPeriodType.NonDeterministic,
  ];
  public minDate: DateTime = DateTime.utc();
  public lspTaskStateEnum = LspTaskState;
  public readonly permAttribute = PermAttributeName.UpdateLspTask;

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service provided for TaskComponent');
    }

    this.getMonitor = this.getMonitor.repeat();

    this.service
      .getLspTasks$()
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(tasks => {
        this.rawLspTasks = tasks;
        this.lspTasks.data = tasks.map(entry => {
          return this.prepareLspTask(entry);
        });
        this.allMonitors = flatten(this.lspTasks.data.map(v => [v.postMonitor])).concat(
          this.getMonitor,
        );
      });
  }

  /** Update notification selected */
  public updateLspTaskEntry(entry: FormGroupTaskEntry): void {
    const updatedTask: LspTask = entry.lspTask;
    updatedTask.nextExecutionUtc = entry.formGroup.controls.nextExecutionUtc.value;
    updatedTask.periodInSeconds = entry.formGroup.controls.periodInSeconds.value;
    updatedTask.periodType = entry.formGroup.controls.periodType.value;

    this.updateLspTask(updatedTask, entry);
  }

  /** Puts entry in editable state. */
  public runNow(entry: FormGroupTaskEntry): void {
    const updatedTask: LspTask = entry.lspTask;
    updatedTask.nextExecutionUtc = DateTime.utc();

    this.updateLspTask(updatedTask, entry);
  }

  /** Puts entry in editable state. */
  public changeState(entry: FormGroupTaskEntry): void {
    const updatedTask: LspTask = entry.lspTask;
    const newState =
      entry.lspTask.state == LspTaskState.Disabled ? LspTaskState.Pending : LspTaskState.Disabled;
    updatedTask.state = newState;

    this.updateLspTask(updatedTask, entry);
  }

  /** Puts entry in editable state. */
  public editEntry(entry: FormGroupTaskEntry): void {
    entry.edit = true;
  }

  /** Reverts an entry from edit state. */
  public revertEntryEdit(entry: FormGroupTaskEntry): void {
    entry.edit = false;
    const rawEntry = this.rawLspTasks.find(v => v.id == entry.lspTask.id);
    entry.formGroup.controls.nextExecutionUtc.setValue(rawEntry.nextExecutionUtc);
    entry.formGroup.controls.periodInSeconds.setValue(rawEntry.periodInSeconds);
    entry.formGroup.controls.periodType.setValue(rawEntry.periodType);
    entry.postMonitor = new ActionMonitor('Edit Task');
  }

  private prepareLspTask(lspTask: LspTask): FormGroupTaskEntry {
    const formControls = {
      nextExecutionUtc: new FormControl(lspTask.nextExecutionUtc, [Validators.required]),
      periodInSeconds: new FormControl(lspTask.periodInSeconds, [Validators.required]),
      periodType: new FormControl(lspTask.periodType, [Validators.required]),
    };
    const newControls = <FormGroupTaskEntry>{
      formGroup: new FormGroup(formControls),
      formControls: formControls,
      postMonitor: new ActionMonitor('Edit Task'),
      lspTask: lspTask,
    };

    return newControls;
  }

  private updateLspTask(task: LspTask, entry: FormGroupTaskEntry): void {
    entry.postMonitor = entry.postMonitor.repeat();
    this.service
      .updateLspTask$(task)
      .pipe(entry.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => this.replaceRawEntry(entry));
  }

  private replaceRawEntry(entry: FormGroupTaskEntry): void {
    entry.edit = false;
    const rawEntry = this.rawLspTasks.find(v => v.id == entry.lspTask.id);

    rawEntry.nextExecutionUtc = entry.formGroup.controls.nextExecutionUtc.value;
    rawEntry.periodInSeconds = entry.formGroup.controls.periodInSeconds.value;
    rawEntry.periodType = entry.formGroup.controls.periodType.value;

    this.lspTasks._updateChangeSubscription();
  }
}
